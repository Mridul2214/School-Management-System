const asyncHandler = require('express-async-handler');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const { Student } = require('../models/User');

// @desc    Get all fee structures
// @route   GET /api/fees
// @access  Private
const getFees = asyncHandler(async (req, res) => {
    const fees = await Fee.find({}).populate('department', 'name').populate('course', 'name');
    res.json(fees);
});

// @desc    Create a fee structure
// @route   POST /api/fees
// @access  Private/Admin
const createFee = asyncHandler(async (req, res) => {
    const { name, type, amount, description, department, course, semester, dueDate } = req.body;
    const fee = await Fee.create({ name, type, amount, description, department, course, semester, dueDate });
    res.status(201).json(fee);
});

// @desc    Record a payment
// @route   POST /api/fees/pay
// @access  Private/Admin
const recordPayment = asyncHandler(async (req, res) => {
    const { studentId, feeId, amountPaid, method, transactionId, remarks } = req.body;

    const payment = await Payment.create({
        student: studentId,
        fee: feeId,
        amountPaid,
        method,
        transactionId,
        remarks
    });

    res.status(201).json(payment);
});

// @desc    Get student payment history
// @route   GET /api/fees/student/:id
// @access  Private
const getStudentPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({ student: req.params.id })
        .populate('fee')
        .sort({ date: -1 });
    res.json(payments);
});

// @desc    Get students with pending fees (Simplified for demo: checks if they have NOT paid a specific fee)
//          In a real app, you'd sum up payments and compare with fee amount.
// @route   GET /api/fees/pending
// @access  Private/Admin
const getPendingFees = asyncHandler(async (req, res) => {
    // This is complex. For simplicity, we'll return all payments for now
    // and let frontend calculate pending.
    // Ideally: Aggregate all students, lookup payments, sum them, subtract from applicable fees.
    res.json({ message: "Pending calculation to be implemented" });
});

module.exports = { getFees, createFee, recordPayment, getStudentPayments };
