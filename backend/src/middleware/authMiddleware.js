const prisma = require('../utils/prisma');

exports.protect = async (req, res, next) => {
    try {
        const auth = req.auth;

        if (!auth || !auth.userId) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Find user in our DB to get their role
        const user = await prisma.user.findUnique({
            where: { clerkId: auth.userId }
        });

        if (user) {
            req.user = user;
        } else {
            // User exists in Clerk but not yet in our DB
            req.user = { id: null, role: 'STUDENT', clerkId: auth.userId };
        }

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route` });
        }
        next();
    };
};
