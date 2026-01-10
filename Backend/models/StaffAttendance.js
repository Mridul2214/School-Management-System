const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'On Leave', 'Half Day'],
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

// Index for performance and uniqueness
staffAttendanceSchema.index({ date: 1, staff: 1 }, { unique: true });

const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);

module.exports = StaffAttendance;
