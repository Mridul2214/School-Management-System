const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).populate('department', 'name code');
    res.json(courses);
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const { name, code, department, duration, totalCredits, description } = req.body;

    const courseExists = await Course.findOne({ code });
    if (courseExists) {
        res.status(400);
        throw new Error('Course code already exists');
    }

    const course = await Course.create({
        name, code, department, duration, totalCredits, description
    });

    if (course) {
        res.status(201).json(course);
    } else {
        res.status(400);
        throw new Error('Invalid course data');
    }
});

module.exports = { getCourses, createCourse };
