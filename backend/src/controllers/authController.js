const prisma = require('../utils/prisma');
const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

exports.logout = (req, res) => {
    // Clerk handles logout on frontend, but we can clear any local cookies if they exist
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    try {
        // req.user is now populated by Clerk middleware
        const clerkId = req.auth.userId;
        if (!clerkId) return res.status(401).json({ message: 'Not authenticated' });

        let user = await prisma.user.findUnique({ where: { clerkId: clerkId } });

        // If user doesn't exist in our DB but exists in Clerk, sync them
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;

            user = await prisma.user.upsert({
                where: { email: email },
                update: { clerkId: clerkId },
                create: {
                    clerkId: clerkId,
                    email: email,
                    name: name,
                    role: 'STUDENT' // Default role
                }
            });
        }

        res.json(user);
    } catch (error) {
        console.error('getMe Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.syncUser = async (req, res) => {
    try {
        const { clerkId, email, name, role } = req.body;

        const user = await prisma.user.upsert({
            where: { clerkId: clerkId },
            update: {
                email: email,
                name: name,
                role: role || 'STUDENT'
            },
            create: {
                clerkId: clerkId,
                email: email,
                name: name,
                role: role || 'STUDENT'
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ message: 'Sync failed' });
    }
};

exports.becomeOrganizer = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: 'ORGANIZER' }
        });

        res.json({
            message: 'You are now an event organizer!',
            user
        });
    } catch (error) {
        console.error('Role upgrade error:', error);
        res.status(500).json({ message: 'Failed to upgrade role' });
    }
};
