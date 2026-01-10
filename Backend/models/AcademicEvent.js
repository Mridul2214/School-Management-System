const mongoose = require('mongoose');

const academicEventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: ['Holiday', 'Exam', 'Event', 'Academic', 'Holiday-Institutional'],
            default: 'Event'
        },
        category: {
            type: String, // e.g., "Registration", "Cultural", "Sports"
        },
        color: {
            type: String,
            default: '#3b82f6' // Default blue
        }
    },
    {
        timestamps: true
    }
);

const AcademicEvent = mongoose.model('AcademicEvent', academicEventSchema);

module.exports = AcademicEvent;
