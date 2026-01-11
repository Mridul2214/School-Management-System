const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { User, Administrator } = require('./models/User');

dotenv.config();
connectDB();

const resetAdmin = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for Db connection

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin@123';
        const adminId = 'ADMIN001';

        // Check if ANY user exists with this ID or Email and remove them to be safe
        await User.deleteOne({ userId: adminId });
        await User.deleteOne({ email: adminEmail });

        console.log('Cleaned up old admin records.');

        // Create Fresh Admin
        const admin = await Administrator.create({
            userId: adminId,
            firstName: 'Super',
            lastName: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'Administrator',
            designation: 'System Administrator'
        });

        console.log('Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetAdmin();
