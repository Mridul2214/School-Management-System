const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
    {
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        semester: {
            type: Number,
            required: true
        },
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true
        },
        startTime: {
            type: String, // Format: "10:00"
            required: true
        },
        endTime: {
            type: String, // Format: "11:00"
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        roomNumber: {
            type: String,
            required: true
        },
        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Compound index to ensure no double booking for a teacher at the same time and day
timetableSchema.index({ teacher: 1, day: 1, startTime: 1 }, { unique: true });

// Compound index to ensure no double booking for a room at the same time and day
timetableSchema.index({ roomNumber: 1, day: 1, startTime: 1 }, { unique: true });

// Compound index to ensure a class (dept+sem) doesn't have two subjects at once
timetableSchema.index({ department: 1, semester: 1, day: 1, startTime: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
