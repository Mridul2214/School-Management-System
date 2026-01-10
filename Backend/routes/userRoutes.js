const express = require('express');
const router = express.Router();
const { getUsers, getStudents, getDepartmentStaff, updateUserProfile, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/').get(protect, staff, getUsers);
router.route('/students').get(protect, staff, getStudents);
router.route('/department-staff').get(protect, staff, getDepartmentStaff);
router.route('/profile').put(protect, updateUserProfile);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
