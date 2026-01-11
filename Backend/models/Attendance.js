const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student', // Refers to the discriminator
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused'],
            default: 'Present',
            required: true
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

// Prevent duplicate attendance for the same student, subject, and date
attendanceSchema.index({ date: 1, student: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
