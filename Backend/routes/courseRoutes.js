const express = require('express');
const router = express.Router();
const { getCourses, createCourse } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, admin, createCourse);

module.exports = router;
