const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Fix import path - we are in the same directory as these folders now
const { User, Administrator } = require('./models/User');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@school.com';
        const adminPassword = 'admin123';

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for Db connection

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            console.log(`Email: ${adminEmail}`);
            // Note: We can't show the password as it is hashed, but we confirm existence.
        } else {
            console.log('Creating admin user...');
            const admin = await Administrator.create({
                userId: 'ADMIN001',
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
        }
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
