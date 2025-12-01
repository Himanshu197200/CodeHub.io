const prisma = require('../utils/prisma');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.googleLogin = (req, res) => {
    const { role } = req.query;
    const state = role || 'STUDENT';

    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) return res.status(500).json({ message: 'Google Client ID not configured' });

    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&state=${state}&prompt=select_account consent`;

    res.redirect(url);
};

exports.googleCallback = async (req, res) => {
    const { code, state } = req.query;
    const role = state || 'STUDENT';

    if (!code) {
        return res.status(400).json({ message: 'No code provided' });
    }

    try {
        const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const tokenData = tokenResponse.data;

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = userResponse.data;

        let user = await prisma.user.findUnique({ where: { email: userData.email } });

        if (!user) {
            // Use MongoDB native driver to bypass Prisma transaction requirement
            const { MongoClient } = require('mongodb');
            const client = new MongoClient(process.env.DATABASE_URL);

            try {
                await client.connect();
                const db = client.db();
                const usersCollection = db.collection('User');

                const result = await usersCollection.insertOne({
                    email: userData.email,
                    name: userData.name,
                    role: role === 'ORGANIZER' ? 'ORGANIZER' : 'STUDENT',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                // Fetch the created user with Prisma to get proper format
                user = await prisma.user.findUnique({ where: { email: userData.email } });
            } finally {
                await client.close();
            }
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectPath = user.role === 'ORGANIZER' || user.role === 'ADMIN' ? '/host-dashboard' : '/';

        res.redirect(`${frontendUrl}${redirectPath}`);

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
    }
};
