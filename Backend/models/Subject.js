const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true },
    credits: { type: Number, required: true },
    type: { type: String, enum: ['Theory', 'Practical', 'Project'], default: 'Theory' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    syllabus: { type: String }, // URL to file
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
