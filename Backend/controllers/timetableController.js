const asyncHandler = require('express-async-handler');
const Timetable = require('../models/Timetable');

// @desc    Get timetable for a specific course and semester
// @route   GET /api/timetable
// @access  Private
const getTimetable = asyncHandler(async (req, res) => {
    const { courseId, semester } = req.query;

    if (!courseId || !semester) {
        res.status(400);
        throw new Error('Please provide courseId and semester');
    }

    const timetable = await Timetable.find({ course: courseId, semester })
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

// @desc    Get timetable for the logged-in student
// @route   GET /api/timetable/my-timetable
// @access  Private (Student)
const getMyTimetable = asyncHandler(async (req, res) => {
    // If mocking, we might not have course/semester in req.user unless we mock it or pass it.
    // For a real student, we fetch from their record.
    const { Student } = require('../models/User');
    const student = await Student.findById(req.user._id);

    if (!student || !student.course) {
        // Fallback or demo mode: try to get from query or return empty
        const { courseId, semester } = req.query;
        if (courseId && semester) {
            const timetable = await Timetable.find({ course: courseId, semester })
                .populate('subject', 'name code')
                .populate('teacher', 'firstName lastName')
                .sort({ day: 1, startTime: 1 });
            return res.json(timetable);
        }
        return res.json([]);
    }

    const timetable = await Timetable.find({ course: student.course, semester: student.semester })
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

// @desc    Add a new timetable entry
// @route   POST /api/timetable
// @access  Private (Admin)
const addTimetableEntry = asyncHandler(async (req, res) => {
    const { course, semester, day, startTime, endTime, subject, teacher, roomNumber } = req.body;

    // Basic validation handled by Mongoose schema, but we can add logical checks here
    // e.g., endTime > startTime

    const entry = await Timetable.create({
        course,
        semester,
        day,
        startTime,
        endTime,
        subject,
        teacher,
        roomNumber
    });

    const populatedEntry = await Timetable.findById(entry._id)
        .populate('subject', 'name code')
        .populate('teacher', 'firstName lastName');

    res.status(201).json(populatedEntry);
});

// @desc    Delete a timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
const deleteTimetableEntry = asyncHandler(async (req, res) => {
    const entry = await Timetable.findById(req.params.id);

    if (entry) {
        await entry.remove();
        res.json({ message: 'Timetable entry removed' });
    } else {
        res.status(404);
        throw new Error('Entry not found');
    }
});

// @desc    Auto Generate Timetable
// @route   POST /api/timetable/generate
// @access  Private (Admin)
const generateAutoTimetable = asyncHandler(async (req, res) => {
    const { courseId, semester } = req.body;

    // 1. Clear existing timetable for this course/sem
    await Timetable.deleteMany({ course: courseId, semester });

    // 2. Fetch Subjects
    const Subject = require('../models/Subject');
    const subjects = await Subject.find({ course: courseId, semester }).populate('faculty');

    if (!subjects || subjects.length === 0) {
        res.status(400);
        throw new Error('No subjects found for this course and semester');
    }

    // 3. Define Constraints
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"]; // Skip 12:00 lunch
    const defaultRoom = "101-A"; // Simplified: Assume this class stays in one room

    const generatedEntries = [];
    const classesPerSubject = 4; // Target classes per week per subject

    // Helper: Check strict teacher availability from DB
    // Note: In a real "Auto" generator, checking DB in loop is slow, but safe for low volume.
    // For high volume, we'd fetch all teacher schedules first.

    // We will simple-shuffle and fill
    let slotPool = [];
    for (let d of days) {
        for (let t of timeSlots) {
            slotPool.push({ day: d, time: t });
        }
    }

    // Shuffle slots for randomness
    slotPool.sort(() => Math.random() - 0.5);

    let slotIndex = 0;

    for (const sub of subjects) {
        if (!sub.faculty) continue; // Skip subjects without assigned faculty

        let allocated = 0;
        while (allocated < classesPerSubject && slotIndex < slotPool.length) {
            const slot = slotPool[slotIndex]; // Try next available slot

            // Check if teacher is free (globally) at this slot
            const teacherBusy = await Timetable.findOne({
                teacher: sub.faculty._id,
                day: slot.day,
                startTime: slot.time
            });

            // Check if this class/room is free (already handled by slot iteration for class, but check room if generic)
            // For now, we assume this Course+Sem owns 'defaultRoom' exclusively or we don't check room conflicts heavily here.

            if (!teacherBusy) {
                // Determine EndTime (assume 1 hour)
                const [h, m] = slot.time.split(':').map(Number);
                const endTime = `${h + 1 < 10 ? '0' : ''}${h + 1}:${m === 0 ? '00' : m}`;

                generatedEntries.push({
                    course: courseId,
                    semester,
                    day: slot.day,
                    startTime: slot.time,
                    endTime,
                    subject: sub._id,
                    teacher: sub.faculty._id,
                    roomNumber: defaultRoom
                });
                allocated++;
            }

            // Move to next slot chance regardless (simplistic greedy)
            // In a better algo, we'd retry this subject if failed.
            slotIndex++;
        }
    }

    if (generatedEntries.length > 0) {
        await Timetable.insertMany(generatedEntries);

        // Return full populated list
        const fullTimetable = await Timetable.find({ course: courseId, semester })
            .populate('subject', 'name code')
            .populate('teacher', 'firstName lastName')
            .sort({ day: 1, startTime: 1 });

        res.status(201).json(fullTimetable);
    } else {
        res.status(400);
        throw new Error('Could not generate timetable (Check if Subjects have configured Faculty)');
    }
});

// @desc    Get schedule for the logged-in teacher
// @route   GET /api/timetable/my-schedule
// @access  Private (Teacher)
const getStaffSchedule = asyncHandler(async (req, res) => {
    const timetable = await Timetable.find({ teacher: req.user._id })
        .populate('subject', 'name code')
        .populate('course', 'name')
        .sort({ day: 1, startTime: 1 });

    res.json(timetable);
});

module.exports = { getTimetable, getMyTimetable, getStaffSchedule, addTimetableEntry, deleteTimetableEntry, generateAutoTimetable };

