const asyncHandler = require('express-async-handler');
const StaffAttendance = require('../models/StaffAttendance');
const { Staff } = require('../models/User');

// @desc    Mark attendance for staff members
// @route   POST /api/staff-attendance
// @access  Private (Admin)
const markStaffAttendance = asyncHandler(async (req, res) => {
    const { date, records } = req.body; // records: [{ staffId, status }]

    if (!records || records.length === 0) {
        res.status(400);
        throw new Error('No attendance records provided');
    }

    const attendanceData = records.map(record => ({
        date: new Date(date),
        staff: record.staffId,
        status: record.status,
        markedBy: req.user._id
    }));

    const operations = attendanceData.map(doc => ({
        updateOne: {
            filter: { date: doc.date, staff: doc.staff },
            update: { $set: doc },
            upsert: true
        }
    }));

    await StaffAttendance.bulkWrite(operations);

    res.status(201).json({ message: 'Staff attendance marked successfully' });
});

// @desc    Get staff attendance records
// @route   GET /api/staff-attendance
// @access  Private (Admin)
const getStaffAttendance = asyncHandler(async (req, res) => {
    const { date } = req.query;

    let query = {};
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await StaffAttendance.find(query)
        .populate('staff', 'firstName lastName userId department designation');

    res.json(attendance);
});

// @desc    Get all staff for attendance marking
// @route   GET /api/staff-attendance/staff-list
// @access  Private (Admin)
const getStaffList = asyncHandler(async (req, res) => {
    const staff = await Staff.find({ role: 'Staff' })
        .populate('department', 'name')
        .select('_id firstName lastName userId department designation');
    res.json(staff);
});

module.exports = { markStaffAttendance, getStaffAttendance, getStaffList };
