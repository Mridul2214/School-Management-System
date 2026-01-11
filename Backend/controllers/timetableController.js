const asyncHandler = require('express-async-handler');
const Timetable = require('../models/Timetable');
const { User } = require('../models/User');
const Subject = require('../models/Subject');

// @desc    Get timetable for a specific department and semester
// @route   GET /api/timetable
// @access  Private
const getTimetable = asyncHandler(async (req, res) => {
    const { departmentId, semester } = req.query;

    if (!departmentId || !semester) {
        res.status(400);
        throw new Error('Please provide departmentId and semester');
    }

    let filter = { department: departmentId, semester };

    // Students only see published timetable
    if (req.user.role === 'Student') {
        filter.isPublished = true;
    }

    const timetable = await Timetable.find(filter)
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

// @desc    Get timetable for the logged-in student
// @route   GET /api/timetable/my-timetable
// @access  Private (Student)
const getMyTimetable = asyncHandler(async (req, res) => {
    const { Student } = require('../models/User');
    const student = await Student.findById(req.user._id);

    if (!student || !student.department) {
        return res.json([]);
    }

    const timetable = await Timetable.find({
        department: student.department,
        semester: student.semester,
        isPublished: true
    })
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

// @desc    Add a new timetable entry
// @route   POST /api/timetable
// @access  Private (Admin/Staff)
const addTimetableEntry = asyncHandler(async (req, res) => {
    const { department, semester, day, startTime, endTime, subject, teacher, roomNumber } = req.body;

    // Check if this timetable (dept + sem) is already published
    const existingPublished = await Timetable.findOne({ department, semester, isPublished: true });

    const entry = await Timetable.create({
        department,
        semester,
        day,
        startTime,
        endTime,
        subject,
        teacher,
        roomNumber,
        isPublished: !!existingPublished // Inherit publication status
    });

    const populatedEntry = await Timetable.findById(entry._id)
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName');

    res.status(201).json(populatedEntry);
});

// @desc    Delete a timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin/Staff)
const deleteTimetableEntry = asyncHandler(async (req, res) => {
    const entry = await Timetable.findById(req.params.id);

    if (entry) {
        await entry.deleteOne();
        res.json({ message: 'Timetable entry removed' });
    } else {
        res.status(404);
        throw new Error('Entry not found');
    }
});

// @desc    Publish/Unpublish timetable for a dept/sem
// @route   PUT /api/timetable/publish
// @access  Private (Admin/Staff)
const togglePublishTimetable = asyncHandler(async (req, res) => {
    const { departmentId, semester, publish } = req.body;

    await Timetable.updateMany(
        { department: departmentId, semester },
        { isPublished: publish }
    );

    res.json({ message: `Timetable ${publish ? 'published' : 'unpublished'} successfully` });
});

// @desc    Auto Generate Timetable
// @route   POST /api/timetable/generate
// @access  Private (Admin)
const generateAutoTimetable = asyncHandler(async (req, res) => {
    const { departmentId, semester } = req.body;

    // 1. Clear existing timetable for this dept/sem
    await Timetable.deleteMany({ department: departmentId, semester });

    // 2. Fetch Subjects (Filtered by department and semester)
    const subjects = await Subject.find({ department: departmentId, semester });

    if (!subjects || subjects.length === 0) {
        res.status(400);
        throw new Error('No subjects found for this department and semester');
    }

    // 3. Define Constraints (6 classes per day)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
    ];

    const generatedEntries = [];
    let subjectIndex = 0;

    for (const day of days) {
        for (let i = 0; i < timeSlots.length; i++) {
            const sub = subjects[subjectIndex % subjects.length];
            if (sub && sub.faculty) {
                generatedEntries.push({
                    department: departmentId,
                    semester,
                    day,
                    startTime: timeSlots[i].start,
                    endTime: timeSlots[i].end,
                    subject: sub._id,
                    teacher: sub.faculty,
                    roomNumber: `Room ${101 + i}`
                });
            }
            subjectIndex++;
        }
    }

    if (generatedEntries.length > 0) {
        await Timetable.insertMany(generatedEntries);

        const fullTimetable = await Timetable.find({ department: departmentId, semester })
            .populate('subject', 'name code')
            .populate('teacher', 'firstName lastName')
            .sort({ day: 1, startTime: 1 });

        res.status(201).json(fullTimetable);
    } else {
        res.status(400);
        throw new Error('Could not generate timetable. Ensure subjects have assigned faculty.');
    }
});

// @desc    Get schedule for the logged-in teacher
// @route   GET /api/timetable/my-schedule
// @access  Private (Teacher)
const getStaffSchedule = asyncHandler(async (req, res) => {
    const timetable = await Timetable.find({ teacher: req.user._id })
        .populate('subject', 'name code')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

module.exports = {
    getTimetable,
    getMyTimetable,
    getStaffSchedule,
    addTimetableEntry,
    deleteTimetableEntry,
    generateAutoTimetable,
    togglePublishTimetable
};

