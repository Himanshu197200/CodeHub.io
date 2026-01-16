const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = require('./utils/prisma');
const PORT = process.env.PORT || 5001;


const { clerkMiddleware } = require('@clerk/backend');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:5173'
        ];

        const isAllowed = allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle preflight requests for all routes

app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());


const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const teamRoutes = require('./routes/teamRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
    res.send('NST Events API is running');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
