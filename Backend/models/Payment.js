const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        fee: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
        amountPaid: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        method: { type: String, enum: ['Cash', 'Card', 'Online', 'Cheque'], required: true },
        transactionId: { type: String }, // For online/ref
        remarks: { type: String }
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
