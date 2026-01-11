const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email: 'admin@gmail.com' });
        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('User not found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
