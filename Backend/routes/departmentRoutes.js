const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getDepartments).post(protect, admin, createDepartment);

module.exports = router;
