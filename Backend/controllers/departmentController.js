const asyncHandler = require('express-async-handler');
const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({}).populate('hod', 'firstName lastName');
    res.json(departments);
});

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
    const { name, code, description, hod } = req.body;

    const departmentExists = await Department.findOne({ code });
    if (departmentExists) {
        res.status(400);
        throw new Error('Department code already exists');
    }

    const department = await Department.create({
        name,
        code,
        description,
        hod
    });

    if (department) {
        res.status(201).json(department);
    } else {
        res.status(400);
        throw new Error('Invalid department data');
    }
});

module.exports = { getDepartments, createDepartment };
