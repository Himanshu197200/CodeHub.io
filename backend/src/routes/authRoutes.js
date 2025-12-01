const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, logout, getMe, googleLogin, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Google Auth Routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

module.exports = router;
