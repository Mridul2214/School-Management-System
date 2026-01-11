const asyncHandler = require('express-async-handler');
const { User, Administrator, Staff, Student } = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        $or: [
            { email: email },
            { userId: email }
        ]
    }).populate('department', 'name');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            userId: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            department: user.department,
            semester: user.semester,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user (Admin/Staff only in real scenario, public for dev/setup)
// @route   POST /api/auth/register
// @access  Public (for initial setup)
const registerUser = asyncHandler(async (req, res) => {
    const {
        userId, email, password, firstName, lastName, role, // Common
        // Staff/Admin specific
        department, designation,
        // Student specific
        semester
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    let user;
    const finalDept = department === '' ? null : department;

    if (role === 'Administrator') {
        user = await Administrator.create({
            userId, email, password, firstName, lastName, role,
            department: finalDept, designation
        });
    } else if (role === 'Staff') {
        user = await Staff.create({
            userId, email, password, firstName, lastName, role,
            department: finalDept, designation,
            employeeId: userId
        });

        // If designated as HOD, update the department
        if (req.body.isHod && finalDept) {
            const Department = require('../models/Department');
            await Department.findByIdAndUpdate(finalDept, { hod: user._id });
        }
    } else if (role === 'Student') {
        user = await Student.create({
            userId, email, password, firstName, lastName, role,
            department: finalDept,
            registrationNumber: userId,
            semester: semester || 1
        });
    } else {
        res.status(400);
        throw new Error('Invalid user role');
    }

    if (user) {
        res.status(201).json({
            _id: user._id,
            userId: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            department: user.department,
            semester: user.semester,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

module.exports = { loginUser, registerUser };
