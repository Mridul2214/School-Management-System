const express = require('express');
const router = express.Router();
const {
    createExam,
    getExams,
    recordMarks,
    getMarks,
    getStudentResults
} = require('../controllers/examController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getExams)
    .post(protect, staff, createExam);

router.get('/my-results', protect, getStudentResults);

router.route('/marks')
    .get(protect, getMarks)
    .post(protect, staff, recordMarks);

module.exports = router;
