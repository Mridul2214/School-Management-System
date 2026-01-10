const express = require('express');
const router = express.Router();
const {
    getAcademicEvents,
    createAcademicEvent,
    deleteAcademicEvent
} = require('../controllers/academicCalendarController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAcademicEvents)
    .post(protect, admin, createAcademicEvent);

router.route('/:id')
    .delete(protect, admin, deleteAcademicEvent);

module.exports = router;
