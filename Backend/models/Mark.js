const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        marksObtained: {
            type: Number,
            required: true,
            min: 0
        },
        totalMarks: {
            type: Number,
            required: true,
            default: 100
        },
        grade: {
            type: String,
            required: true
        },
        feedback: {
            type: String
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Uniqueness: One student gets one mark record per exam per subject
markSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
