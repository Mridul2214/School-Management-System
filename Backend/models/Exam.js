const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // e.g., 'Mid Term 2026', 'Final Exam'
        },
        type: {
            type: String,
            enum: ['Monthly Test', 'Mid Term', 'Final Exam', 'Practical'],
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        semester: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Scheduled'
        }
    },
    {
        timestamps: true
    }
);

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
