const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = require('./utils/prisma');
const PORT = process.env.PORT || 5001;


app.use(cors({
    origin: process.env.CLIENT_URL || 'https://ap-frontend-sepia.vercel.app',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


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
