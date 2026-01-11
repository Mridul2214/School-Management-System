const express = require('express');
const router = express.Router();
const {
    getTimetable,
    getMyTimetable,
    getStaffSchedule,
    addTimetableEntry,
    deleteTimetableEntry,
    generateAutoTimetable,
    togglePublishTimetable
} = require('../controllers/timetableController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTimetable)
    .post(protect, staff, addTimetableEntry);

router.get('/my-timetable', protect, getMyTimetable);
router.get('/my-schedule', protect, getStaffSchedule);

router.route('/generate')
    .post(protect, staff, generateAutoTimetable);

router.route('/publish')
    .put(protect, staff, togglePublishTimetable);

router.route('/:id')
    .delete(protect, staff, deleteTimetableEntry);

module.exports = router;
