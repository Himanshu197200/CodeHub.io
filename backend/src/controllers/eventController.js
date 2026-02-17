const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const jwt = require('jsonwebtoken');

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        // Check if Cloudinary credentials are missing or are placeholders
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
            process.env.CLOUDINARY_API_KEY === 'your_api_key') {
            console.log('[MOCK CLOUDINARY] Using mock image (credentials missing or placeholders)...');
            return resolve({ secure_url: process.env.DEFAULT_EVENT_BANNER || '' });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'eventx' },
            (error, result) => {
                if (error) {
                    console.error('[CLOUDINARY ERROR]', error);
                    // Fallback to mock image on error
                    console.log('[MOCK CLOUDINARY] Fallback to mock image due to upload error...');
                    return resolve({ secure_url: process.env.DEFAULT_EVENT_BANNER || '' });
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

exports.createEvent = async (req, res) => {
    try {
        const {
            title, description, date, time, venue, type, category,
            maxParticipants, isPaid, price, registrationDeadline, rules, faqs, isHot
        } = req.body;



        let bannerUrl = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            bannerUrl = result.secure_url;
        }


        const eventDate = new Date(date);
        const existingEvent = await prisma.event.findFirst({
            where: {
                venue,
                date: {
                    gte: new Date(eventDate.setHours(0, 0, 0, 0)),
                    lt: new Date(eventDate.setHours(23, 59, 59, 999))
                },
                time: time
            }
        });

        if (existingEvent) {
            return res.status(409).json({
                message: `Venue '${venue}' is already booked at this time.`,
                suggestion: 'Try a different time or venue.'
            });
        }

        // Use MongoDB native driver to bypass Prisma transaction requirement
        const { MongoClient, ObjectId } = require('mongodb');
        const client = new MongoClient(process.env.DATABASE_URL);

        let event;
        try {
            await client.connect();
            const db = client.db();
            const eventsCollection = db.collection('Event');

            const eventData = {
                title,
                description,
                banner: bannerUrl,
                date: new Date(date),
                time,
                venue,
                type,
                category,
                maxParticipants: parseInt(maxParticipants),
                isPaid: isPaid === 'true' || isPaid === true,
                price: price ? parseFloat(price) : null,
                registrationDeadline: new Date(registrationDeadline),
                rules: rules ? [rules] : [],
                faqs: faqs ? { question: 'General', answer: faqs } : null,
                isHot: isHot === 'true' || isHot === true,
                organizerId: new ObjectId(req.user.id),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await eventsCollection.insertOne(eventData);

            // Fetch the created event with Prisma to get proper format
            event = await prisma.event.findUnique({
                where: { id: result.insertedId.toString() }
            });
        } finally {
            await client.close();
        }

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create event' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { category, type, search } = req.query;

        const where = {};
        if (category) where.category = category;
        if (type) where.type = type;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const events = await prisma.event.findMany({
            where,
            orderBy: { date: 'asc' },
            include: { organizer: { select: { name: true } } }
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: {
                organizer: { select: { name: true, email: true } },
                registrations: { select: { userId: true } }
            }
        });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || (await prisma.user.findUnique({ where: { clerkId: req.user.clerkId } }))?.id;

        if (!userId) {
            return res.status(404).json({ message: 'User profile not found. Please sync your account.' });
        }

        const { mobile, gender, organization, type, differentlyAbled, location } = req.body;

        const event = await prisma.event.findUnique({
            where: { id },
            include: { registrations: true }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });




        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId: id
                }
            }
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }


        if (event.registrations.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'Event is full' });
        }


        if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ message: 'Registration deadline passed' });
        }


        const registration = await prisma.registration.create({
            data: {
                userId,
                eventId: id,
                mobile,
                gender,
                organization,
                type,
                differentlyAbled,
                location
            }
        });

        res.status(201).json({ message: 'Successfully registered', registration });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

exports.registerPublic = async (req, res) => {
    try {
        console.log('Register Public Request:', req.body);
        const { id } = req.params;
        const {
            email,
            firstName, lastName, mobile, gender, organization, type, differentlyAbled, location
        } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const cleanEmail = email.trim();




        let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        let isNewUser = false;

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: cleanEmail,
                    name: `${firstName || ''} ${lastName || ''}`.trim() || 'Guest User',
                    role: 'STUDENT',
                }
            });
            isNewUser = true;
        }


        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });


        const event = await prisma.event.findUnique({
            where: { id },
            include: { registrations: true }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });


        if (event.registrations.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'Event is full' });
        }


        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ message: 'Registration deadline passed' });
        }


        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId: id
                }
            }
        });

        if (existingRegistration) {
            return res.status(200).json({
                message: 'Already registered',
                token,
                user,
                registration: existingRegistration
            });
        }


        const registration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: id,
                mobile,
                gender,
                organization,
                type,
                differentlyAbled,
                location
            }
        });

        res.status(201).json({
            message: 'Successfully registered',
            token,
            user,
            registration
        });


    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, date, time, venue, type, category,
            maxParticipants, isPaid, price, registrationDeadline, rules, faqs, isHot
        } = req.body;

        // Check if event exists and user is the organizer
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        // Handle banner upload if provided
        let bannerUrl = event.banner;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            bannerUrl = result.secure_url;
        }

        // Use MongoDB native driver to bypass Prisma transaction requirement
        const { MongoClient, ObjectId } = require('mongodb');
        const client = new MongoClient(process.env.DATABASE_URL);

        let updatedEvent;
        try {
            await client.connect();
            const db = client.db();
            const eventsCollection = db.collection('Event');

            const updateData = {
                title: title || event.title,
                description: description !== undefined ? description : event.description,
                banner: bannerUrl,
                date: date ? new Date(date) : event.date,
                time: time || event.time,
                venue: venue || event.venue,
                type: type || event.type,
                category: category || event.category,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : event.maxParticipants,
                isPaid: isPaid !== undefined ? (isPaid === 'true' || isPaid === true) : event.isPaid,
                price: price !== undefined ? (price ? parseFloat(price) : null) : event.price,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : event.registrationDeadline,
                rules: rules !== undefined ? [rules] : event.rules,
                faqs: faqs !== undefined ? { question: 'General', answer: faqs } : event.faqs,
                isHot: isHot !== undefined ? (isHot === 'true' || isHot === true) : event.isHot,
                updatedAt: new Date()
            };

            await eventsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            // Fetch updated event
            updatedEvent = await prisma.event.findUnique({ where: { id } });
        } finally {
            await client.close();
        }

        res.json(updatedEvent);
    } catch (error) {
        console.error('Update Event Error:', error);
        res.status(500).json({ message: 'Failed to update event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists and user is the organizer
        const event = await prisma.event.findUnique({
            where: { id },
            include: { registrations: true }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        // Use MongoDB native driver to bypass Prisma transaction requirement
        const { MongoClient, ObjectId } = require('mongodb');
        const client = new MongoClient(process.env.DATABASE_URL);

        try {
            await client.connect();
            const db = client.db();
            const eventsCollection = db.collection('Event');
            const registrationsCollection = db.collection('Registration');

            // Delete all registrations first (cascade)
            await registrationsCollection.deleteMany({ eventId: new ObjectId(id) });

            // Delete the event
            await eventsCollection.deleteOne({ _id: new ObjectId(id) });
        } finally {
            await client.close();
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete Event Error:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
};


exports.registerTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { teamName, members, email, firstName, lastName, ...leaderDetails } = req.body;

        if (!teamName) return res.status(400).json({ message: 'Team name is required' });

        const event = await prisma.event.findUnique({
            where: { id },
            include: { registrations: true }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.type !== 'TEAM') return res.status(400).json({ message: 'This is not a team event' });

        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ message: 'Registration deadline passed' });
        }

        const newMemberCount = 1 + (members ? members.length : 0);
        if (event.registrations.length + newMemberCount > event.maxParticipants) {
            return res.status(400).json({ message: 'Not enough spots left in the event' });
        }

        // Check if leader already registered
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId: id
                }
            }
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Create Team
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const team = await prisma.team.create({
            data: {
                name: teamName,
                code,
                eventId: id
            }
        });

        // Register Leader
        await prisma.registration.create({
            data: {
                userId,
                eventId: id,
                teamId: team.id,
                ...leaderDetails
            }
        });

        await prisma.teamMember.create({
            data: {
                teamId: team.id,
                userId,
                status: 'ACCEPTED'
            }
        });

        // Register Members
        if (members && members.length > 0) {
            for (const member of members) {
                const { email, firstName, lastName, ...memberDetails } = member;

                let user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: `${firstName} ${lastName}`,
                            role: 'STUDENT'
                        }
                    });
                }

                // Check if member already registered
                const memReg = await prisma.registration.findUnique({
                    where: { userId_eventId: { userId: user.id, eventId: id } }
                });

                if (!memReg) {
                    await prisma.registration.create({
                        data: {
                            userId: user.id,
                            eventId: id,
                            teamId: team.id,
                            ...memberDetails
                        }
                    });

                    await prisma.teamMember.create({
                        data: {
                            teamId: team.id,
                            userId: user.id,
                            status: 'ACCEPTED'
                        }
                    });
                }
            }
        }

        res.status(201).json({ message: 'Team registered successfully', team });

    } catch (error) {
        console.error('Team Registration Error:', error);
        res.status(500).json({ message: error.message || 'Team registration failed' });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const events = await prisma.event.findMany({
            where: { organizerId: userId },
            include: {
                registrations: {
                    select: {
                        id: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                organizer: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const eventsWithStats = events.map(event => ({
            ...event,
            registrationCount: event.registrations.length,
            spotsLeft: event.maxParticipants - event.registrations.length
        }));

        res.json(eventsWithStats);
    } catch (error) {
        console.error('Get My Events Error:', error);
        res.status(500).json({ message: 'Failed to fetch your events' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await prisma.event.findUnique({ where: { id } });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizerId !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'You are not authorized to edit this event'
            });
        }

        let bannerUrl = event.banner;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            bannerUrl = result.secure_url;
        }

        const {
            title, description, date, time, venue, type, category,
            maxParticipants, isPaid, price, registrationDeadline, rules, faqs
        } = req.body;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                banner: bannerUrl,
                date: date ? new Date(date) : event.date,
                time,
                venue,
                type,
                category,
                maxParticipants: maxParticipants ? parseInt(maxParticipants) : event.maxParticipants,
                isPaid: isPaid !== undefined ? isPaid === 'true' : event.isPaid,
                registrationFee: price ? parseFloat(price) : event.registrationFee,
                registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : event.registrationDeadline,
                rules: rules ? (typeof rules === 'string' ? JSON.parse(rules) : rules) : event.rules,
                faqs: faqs ? (typeof faqs === 'string' ? JSON.parse(faqs) : faqs) : event.faqs
            },
            include: {
                registrations: true,
                organizer: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Update Event Error:', error);
        res.status(500).json({ message: 'Failed to update event' });
    }
};
