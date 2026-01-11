const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const { Student } = require('../models/User');

// @desc    Mark attendance for a list of students
// @route   POST /api/attendance
// @access  Private (Admin/Staff)
const markAttendance = asyncHandler(async (req, res) => {
    const { date, departmentId, subjectId, records } = req.body; // records: [{ studentId, status }]

    if (!records || records.length === 0) {
        res.status(400);
        throw new Error('No attendance records provided');
    }

    const attendanceData = records.map(record => ({
        date: new Date(date),
        student: record.studentId,
        department: departmentId,
        subject: subjectId,
        status: record.status,
        markedBy: req.user._id
    }));

    // Upsert operation: Update if exists, Insert if new
    const operations = attendanceData.map(doc => ({
        updateOne: {
            filter: { date: doc.date, student: doc.student, subject: doc.subject },
            update: { $set: doc },
            upsert: true
        }
    }));

    await Attendance.bulkWrite(operations);

    res.status(201).json({ message: 'Attendance marked successfully' });
});

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = asyncHandler(async (req, res) => {
    const { date, departmentId, subjectId } = req.query;

    let query = {};
    if (date) query.date = new Date(date);
    if (departmentId) query.department = departmentId;
    if (subjectId) query.subject = subjectId;

    const attendance = await Attendance.find(query)
        .populate('student', 'firstName lastName userId')
        .sort({ 'student.firstName': 1 });

    res.json(attendance);
});

// @desc    Get students for attendance marking (Filter by Department/Semester)
// @route   GET /api/attendance/students
// @access  Private
const getStudentsForAttendance = asyncHandler(async (req, res) => {
    const { departmentId, semester } = req.query;

    let query = {};
    if (departmentId) query.department = departmentId;
    if (semester) query.semester = semester;

    const students = await Student.find(query).select('_id firstName lastName userId rollNumber');
    res.json(students);
});

module.exports = { markAttendance, getAttendance, getStudentsForAttendance };
