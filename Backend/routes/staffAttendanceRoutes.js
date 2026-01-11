const express = require('express');
const router = express.Router();
const { markStaffAttendance, getStaffAttendance, getStaffList, markOwnAttendance } = require('../controllers/staffAttendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect); // All routes require login

// Staff Route
router.post('/mark-self', markOwnAttendance);

// Admin Routes (Apply admin middleware)
router.use(admin);
router.post('/', markStaffAttendance);
router.get('/', getStaffAttendance);
router.get('/staff-list', getStaffList);

module.exports = router;
