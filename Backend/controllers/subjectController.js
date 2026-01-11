const asyncHandler = require('express-async-handler');
const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({})
        .populate('department', 'name')
        .populate('faculty', 'firstName lastName');
    res.json(subjects);
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
    const { name, code, semester, credits, type, department, faculty, syllabus } = req.body;

    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
        res.status(400);
        throw new Error('Subject code already exists');
    }

    const subject = await Subject.create({
        name, code, semester, credits, type, department, faculty, syllabus
    });

    if (subject) {
        res.status(201).json(subject);
    } else {
        res.status(400);
        throw new Error('Invalid subject data');
    }
});

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
        .populate('department', 'name')
        .populate('faculty', 'firstName lastName');

    if (subject) {
        res.json(subject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
    const { name, code, semester, credits, type, department, faculty, syllabus } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (subject) {
        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.semester = semester || subject.semester;
        subject.credits = credits || subject.credits;
        subject.type = type || subject.type;
        subject.department = department || subject.department;
        subject.faculty = faculty || subject.faculty;
        subject.syllabus = syllabus || subject.syllabus;

        const updatedSubject = await subject.save();
        res.json(updatedSubject);
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject removed' });
    } else {
        res.status(404);
        throw new Error('Subject not found');
    }
});

module.exports = { getSubjects, createSubject, getSubjectById, updateSubject, deleteSubject };
