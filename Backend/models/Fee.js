const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g., "Semester 1 Tuition", "Lab Fee"
        type: { type: String, enum: ['Tuition', 'Library', 'Hostel', 'Transport', 'Exam', 'Other'], required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Optional: If specific to dept
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional: If specific to course
        semester: { type: Number }, // Optional: If specific to sem
        dueDate: { type: Date }
    },
    { timestamps: true }
);

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
