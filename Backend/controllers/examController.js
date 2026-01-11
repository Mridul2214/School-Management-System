const asyncHandler = require('express-async-handler');
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private (Admin)
const createExam = asyncHandler(async (req, res) => {
    const { name, type, department, semester, startDate, endDate } = req.body;

    const exam = await Exam.create({
        name,
        type,
        department,
        semester,
        startDate,
        endDate
    });

    res.status(201).json(exam);
});

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = asyncHandler(async (req, res) => {
    const { department, semester } = req.query;
    let query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;

    const exams = await Exam.find(query).populate('department', 'name code');
    res.json(exams);
});

// @desc    Record marks for students
// @route   POST /api/exams/marks
// @access  Private (Staff/Admin)
const recordMarks = asyncHandler(async (req, res) => {
    const { examId, subjectId, marksData } = req.body; // marksData: [{ studentId, marksObtained, totalMarks, grade, feedback }]

    if (!marksData || marksData.length === 0) {
        res.status(400);
        throw new Error('No marks data provided');
    }

    const operations = marksData.map(data => ({
        updateOne: {
            filter: { exam: examId, student: data.studentId, subject: subjectId },
            update: {
                $set: {
                    marksObtained: data.marksObtained,
                    totalMarks: data.totalMarks,
                    grade: data.grade,
                    feedback: data.feedback,
                    markedBy: req.user._id
                }
            },
            upsert: true
        }
    }));

    await Mark.bulkWrite(operations);

    res.status(201).json({ message: 'Marks recorded successfully' });
});

// @desc    Get marks for an exam/subject
// @route   GET /api/exams/marks
// @access  Private
const getMarks = asyncHandler(async (req, res) => {
    const { examId, subjectId, studentId } = req.query;
    let query = {};
    if (examId) query.exam = examId;
    if (subjectId) query.subject = subjectId;
    if (studentId) query.student = studentId;

    const marks = await Mark.find(query)
        .populate('student', 'firstName lastName userId')
        .populate('subject', 'name code')
        .populate('exam', 'name');

    res.json(marks);
});

// @desc    Get marks for the logged-in student
// @route   GET /api/exams/my-results
// @access  Private (Student)
const getStudentResults = asyncHandler(async (req, res) => {
    // If mocking with admin_123, we might not find many matches unless we create them
    // But in a real scenario, req.user._id is the student's ID
    const marks = await Mark.find({ student: req.user._id })
        .populate('subject', 'name code')
        .populate('exam', 'name type startDate')
        .sort({ createdAt: -1 });

    res.json(marks);
});

module.exports = {
    createExam,
    getExams,
    recordMarks,
    getMarks,
    getStudentResults
};
