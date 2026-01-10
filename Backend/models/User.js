const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const options = { discriminatorKey: 'role', timestamps: true };

// Base User Schema
const userSchema = new mongoose.Schema(
    {
        userId: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String },
        avatar: { type: String },
        isActive: { type: Boolean, default: true },
        mfaEnabled: { type: Boolean, default: false },
        mfaSecret: { type: String },
        lastLogin: { type: Date },
    },
    options
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Administrator Schema
const Administrator = User.discriminator(
    'Administrator',
    new mongoose.Schema({
        department: { type: String },
        designation: { type: String },
        permissions: [{ type: String }],
    })
);

// Staff Schema
const Staff = User.discriminator(
    'Staff',
    new mongoose.Schema({
        employeeId: { type: String, unique: true, sparse: true },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        designation: { type: String },
        qualification: { type: String },
        subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
        joiningDate: { type: Date },
        salary: { type: Number },
    })
);

// Student Schema
const Student = User.discriminator(
    'Student',
    new mongoose.Schema({
        registrationNumber: { type: String, unique: true, sparse: true },
        rollNumber: { type: String },
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        semester: { type: Number },
        batch: { type: String },
        section: { type: String },
        admissionDate: { type: Date },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        bloodGroup: { type: String },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String },
        },
        guardianDetails: {
            name: { type: String },
            relation: { type: String },
            phone: { type: String },
            email: { type: String },
        },
        currentCGPA: { type: Number },
        totalCredits: { type: Number },
        hostelAllocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
        transportRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
    })
);

module.exports = { User, Administrator, Staff, Student };
