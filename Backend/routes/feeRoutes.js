const express = require('express');
const router = express.Router();
const { getFees, createFee, recordPayment, getStudentPayments } = require('../controllers/feeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFees)
    .post(protect, admin, createFee);

router.route('/pay')
    .post(protect, admin, recordPayment);

router.route('/student/:id')
    .get(protect, getStudentPayments);

module.exports = router;
