const express = require('express');
const router = express.Router();
const { markStaffAttendance, getStaffAttendance, getStaffList } = require('../controllers/staffAttendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.post('/', markStaffAttendance);
router.get('/', getStaffAttendance);
router.get('/staff-list', getStaffList);

module.exports = router;
