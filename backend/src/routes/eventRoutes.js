const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, registerForEvent, registerPublic, updateEvent, deleteEvent, registerTeam, getMyEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getEvents);
router.get('/my-events', protect, authorize('ORGANIZER', 'ADMIN'), getMyEvents);
router.get('/:id', getEventById);

router.post('/', protect, authorize('ORGANIZER', 'ADMIN', 'FACULTY'), upload.single('banner'), createEvent);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), upload.single('banner'), updateEvent);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/register-team', protect, registerTeam);
router.post('/:id/register-public', registerPublic);

module.exports = router;
