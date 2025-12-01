const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const jwt = require('jsonwebtoken');

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.log('[MOCK CLOUDINARY] Uploading image...');
            return resolve({ secure_url: 'https://via.placeholder.com/800x400' });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'eventx' },
            (error, result) => {
                if (error) return reject(error);
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
            maxParticipants, isPaid, price, registrationDeadline, rules, faqs
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

        const event = await prisma.event.create({
            data: {
                title,
                description,
                banner: bannerUrl,
                date: new Date(date),
                time,
                venue,
                type,
                category,
                maxParticipants: parseInt(maxParticipants),
                isPaid: isPaid === 'true',
                price: price ? parseFloat(price) : null,
                registrationDeadline: new Date(registrationDeadline),
                rules: rules ? [rules] : [],
                faqs: faqs ? { question: 'General', answer: faqs } : null,
                organizerId: req.user.id
            }
        });

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
        const userId = req.user.id;
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


        if (new Date() > new Date(event.registrationDeadline)) {
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
