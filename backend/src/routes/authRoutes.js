const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/sync', authController.syncUser);

module.exports = router;
