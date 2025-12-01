const express = require('express');
const { createFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:eventId', protect, createFeedback);
router.get('/:eventId', protect, getEventFeedback);

module.exports = router;