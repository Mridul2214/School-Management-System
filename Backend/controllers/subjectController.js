const asyncHandler = require('express-async-handler');
const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({})
        .populate('course', 'name')
        .populate('department', 'name')
        .populate('faculty', 'firstName lastName');
    res.json(subjects);
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
    const { name, code, course, semester, credits, type, department, faculty, syllabus } = req.body;

    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
        res.status(400);
        throw new Error('Subject code already exists');
    }

    const subject = await Subject.create({
        name, code, course, semester, credits, type, department, faculty, syllabus
    });

    if (subject) {
        res.status(201).json(subject);
    } else {
        res.status(400);
        throw new Error('Invalid subject data');
    }
});

module.exports = { getSubjects, createSubject };
