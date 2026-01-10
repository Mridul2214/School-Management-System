const asyncHandler = require('express-async-handler');
const AcademicEvent = require('../models/AcademicEvent');

// @desc    Get all academic events
// @route   GET /api/academic-calendar
// @access  Private
const getAcademicEvents = asyncHandler(async (req, res) => {
    let events = await AcademicEvent.find({}).sort({ startDate: 1 });

    // Auto-seed sample events if empty
    if (events.length === 0) {
        const year = new Date().getFullYear();
        const samples = [
            {
                title: 'Spring Semester Begins',
                description: 'Classes start for all departments',
                startDate: new Date(year, 0, 15),
                endDate: new Date(year, 0, 15),
                type: 'Academic',
                color: '#10b981'
            },
            {
                title: 'Annual Tech Fest',
                description: 'Institutional technical competition',
                startDate: new Date(year, 1, 10),
                endDate: new Date(year, 1, 12),
                type: 'Event',
                color: '#8b5cf6'
            },
            {
                title: 'Mid-Term Examinations',
                startDate: new Date(year, 2, 5),
                endDate: new Date(year, 2, 12),
                type: 'Exam',
                color: '#f59e0b'
            }
        ];
        await AcademicEvent.insertMany(samples);
        events = await AcademicEvent.find({}).sort({ startDate: 1 });
    }

    res.json(events);
});

// @desc    Create an academic event
// @route   POST /api/academic-calendar
// @access  Private (Admin)
const createAcademicEvent = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, type, category, color } = req.body;

    const event = await AcademicEvent.create({
        title,
        description,
        startDate,
        endDate,
        type,
        category,
        color
    });

    res.status(201).json(event);
});

// @desc    Delete an academic event
// @route   DELETE /api/academic-calendar/:id
// @access  Private (Admin)
const deleteAcademicEvent = asyncHandler(async (req, res) => {
    const event = await AcademicEvent.findById(req.params.id);

    if (event) {
        await event.remove();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
    getAcademicEvents,
    createAcademicEvent,
    deleteAcademicEvent
};
