const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createFeedback = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { rating, comment, improvements } = req.body;
        const userId = req.user.id;


        const registration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            }
        });

        if (!registration) {
            return res.status(403).json({ message: 'You must be registered for this event to give feedback.' });
        }


        const existingFeedback = await prisma.feedback.findFirst({
            where: {
                userId,
                eventId
            }
        });

        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already submitted feedback for this event.' });
        }

        const feedback = await prisma.feedback.create({
            data: {
                rating: parseInt(rating),
                comment,
                improvements,
                eventId,
                userId
            }
        });

        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEventFeedback = async (req, res) => {
    try {
        const { eventId } = req.params;

        const feedbacks = await prisma.feedback.findMany({
            where: { eventId },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createFeedback, getEventFeedback };
