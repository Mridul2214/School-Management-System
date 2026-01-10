const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    duration: { type: Number, required: true }, // number of semesters
    totalCredits: { type: Number },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
