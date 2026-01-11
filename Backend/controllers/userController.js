const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const Department = require('../models/Department');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const { role, department } = req.query;
    let query = {};
    if (role) query.role = role;
    if (department) query.department = department;

    let users = await User.find(query).populate('department', 'name');
    res.json(users);
});

// @desc    Get filtered students for staff
// @route   GET /api/users/students
// @access  Private/Staff
const getStudents = asyncHandler(async (req, res) => {
    const { department, semester } = req.query;
    let query = { role: 'Student' };

    // If Staff, restrict to their department
    if (req.user.role === 'Staff') {
        if (req.user.department) {
            query.department = req.user.department;
        }
    } else if (department && department !== 'undefined') {
        query.department = department;
    }

    if (semester && semester !== 'undefined') query.semester = Number(semester);

    const students = await User.find(query)
        .populate('department', 'name');

    res.json(students);
});

// @desc    Get staff in department (for HOD)
// @route   GET /api/users/department-staff
// @access  Private/Staff (HOD focused)
const getDepartmentStaff = asyncHandler(async (req, res) => {
    // If Admin, they can pass department in query. If Staff, use their own.
    let deptId = req.query.department || req.user.department;

    if (!deptId) {
        res.status(400);
        throw new Error('Department not found in your profile');
    }

    const staff = await User.find({
        role: 'Staff',
        department: deptId
    }).populate('department', 'name').select('-password');

    res.json(staff);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            userId: updatedUser.userId,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            token: req.headers.authorization.split(' ')[1]
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Helper to handle empty strings for ObjectIds
        const cleanId = (id) => (id === '' || id === 'undefined' ? null : id);

        // Common Fields
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.email) user.email = req.body.email;
        if (req.body.userId) {
            user.userId = req.body.userId;
            // Sync with discriminator specific fields
            if (user.role === 'Staff') user.employeeId = req.body.userId;
            if (user.role === 'Student') user.registrationNumber = req.body.userId;
        }
        if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
        if (req.body.phone !== undefined) user.phone = req.body.phone;

        // Role specific fields
        if (user.role === 'Staff' || user.role === 'Administrator') {
            if (req.body.department !== undefined) {
                user.department = cleanId(req.body.department);
            }
            if (req.body.designation !== undefined) {
                user.designation = req.body.designation;
            }

            // Handle HOD Status (Toggle on/off)
            if (user.role === 'Staff') {
                if (req.body.isHod) {
                    // Add HOD label if not present
                    if (!user.designation?.toLowerCase().includes('hod')) {
                        user.designation = user.designation ? `${user.designation} (HOD)` : 'HOD';
                    }
                    // Update Department record
                    if (user.department) {
                        await Department.findByIdAndUpdate(user.department, { hod: user._id });
                    }
                } else {
                    // Remove HOD label if present
                    if (user.designation?.toLowerCase().includes('hod')) {
                        user.designation = user.designation.replace(/\s*\(HOD\)/gi, '').replace(/^HOD$/gi, '').trim();
                    }
                    // Clear HOD from department if this user was the HOD
                    if (user.department) {
                        await Department.findOneAndUpdate({ _id: user.department, hod: user._id }, { hod: null });
                    }
                }
            }
        }

        if (user.role === 'Student') {
            if (req.body.department !== undefined) user.department = cleanId(req.body.department);
            if (req.body.semester !== undefined) user.semester = Number(req.body.semester);
        }

        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password;
        }

        try {
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                department: updatedUser.department
            });
        } catch (error) {
            if (error.code === 11000) {
                res.status(400);
                throw new Error('User ID or Email already exists');
            }
            throw error;
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { getUsers, getStudents, getDepartmentStaff, getProfile, updateUserProfile: updateProfile, updateUser, getUserById, deleteUser };
