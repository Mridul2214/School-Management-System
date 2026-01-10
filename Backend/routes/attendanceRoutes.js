const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getStudentsForAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, markAttendance)
    .get(protect, getAttendance);

router.route('/students').get(protect, getStudentsForAttendance);

module.exports = router;
