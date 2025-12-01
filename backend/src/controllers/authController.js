const prisma = require('../utils/prisma');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });



    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {

        await prisma.otp.upsert({
            where: { email },
            update: { otp, expiresAt },
            create: { email, otp, expiresAt },
        });

        await sendEmail(email, 'NST Events Login OTP', `Your OTP is ${otp}. It expires in 10 minutes.`);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    try {
        const otpRecord = await prisma.otp.findUnique({ where: { email } });

        if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP' });
        if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (new Date() > otpRecord.expiresAt) return res.status(400).json({ message: 'OTP expired' });


        let user = await prisma.user.findUnique({ where: { email } });
        let isNewUser = false;

        if (!user) {

            user = await prisma.user.create({
                data: {
                    email,
                    name: email.split('@')[0],
                    role: 'STUDENT',
                },
            });
            isNewUser = true;
        }


        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });


        await prisma.otp.delete({ where: { email } });


        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Login successful', user, token, isNewUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
};

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
    console.log('=== Google Callback Started ===');
    console.log('Query params:', req.query);

    const { code, state } = req.query;
    const role = state || 'STUDENT';

    if (!code) {
        console.log('ERROR: No code provided');
        return res.status(400).json({ message: 'No code provided' });
    }

    try {
        const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        console.log('Config check:', {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            redirectUri
        });


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
        console.log('Token exchange successful');

        if (!tokenData.access_token) {
            console.error('Google Token Exchange Failed:', tokenData);
            const err = new Error('Failed to get access token');
            err.tokenData = tokenData;
            throw err;
        }


        console.log('Fetching user info from Google...');
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = userResponse.data;
        console.log('User data received:', { email: userData.email, name: userData.name });


        console.log('Looking up user in database...');
        let user = await prisma.user.findUnique({ where: { email: userData.email } });

        if (!user) {
            console.log('User not found, creating new user...');
            user = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    role: role === 'ORGANIZER' ? 'ORGANIZER' : 'STUDENT',
                },
            });
            console.log('User created:', user.id);
        } else {
            console.log('Existing user found:', user.id);
        }


        console.log('Generating JWT...');
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });


        console.log('Setting auth cookie...');
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });



        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3013';


        const redirectPath = user.role === 'ORGANIZER' || user.role === 'ADMIN' ? '/create-event' : '/';

        console.log(`Redirecting to: ${frontendUrl}${redirectPath}`);
        res.redirect(`${frontendUrl}${redirectPath}`);

    } catch (error) {
        console.error('=== Google Auth ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3013'}/login?error=google_auth_failed`);
    }
};
