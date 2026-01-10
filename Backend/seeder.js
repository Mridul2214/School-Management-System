const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Department = require('./models/Department');
const Course = require('./models/Course');

dotenv.config();

connectDB();

const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE', description: 'Study of computers and computational systems.' },
    { name: 'Information Technology', code: 'IT', description: 'Use of systems for storing, retrieving, and sending information.' },
    { name: 'Electronics & Communication', code: 'ECE', description: 'Electronic devices, circuits, communication equipment.' },
    { name: 'Electrical Engineering', code: 'EE', description: 'study and application of electricity, electronics, and electromagnetism.' },
    { name: 'Mechanical Engineering', code: 'ME', description: 'Design, construction, and use of machines.' },
    { name: 'Civil Engineering', code: 'CE', description: 'Design, construction, and maintenance of physical and naturally built environment.' },
    { name: 'Business Administration', code: 'BBA_DEPT', description: 'Management of business operations and decision making.' },
    { name: 'Commerce', code: 'COMM', description: 'Study of trade and business.' },
    { name: 'Science', code: 'SCI', description: 'Natural and physical sciences.' },
    { name: 'Arts & Humanities', code: 'ARTS_DEPT', description: 'Study of human culture and creative expression.' },
    { name: 'Pharmacy', code: 'PHARM', description: 'Study of preparation and dispensing of medicinal drugs.' },
    { name: 'Law', code: 'LAW', description: 'Study of the system of rules of a country.' },

    // User requested these specifically as "departments"
    { name: 'B.Tech', code: 'BTECH_DEPT', description: 'Bachelor of Technology Department' },
    { name: 'B.Sc', code: 'BSC_DEPT', description: 'Bachelor of Science Department' },
    { name: 'B.Com', code: 'BCOM_DEPT', description: 'Bachelor of Commerce Department' },
    { name: 'BCA', code: 'BCA_DEPT', description: 'Bachelor of Computer Applications Department' },
    { name: 'MCA', code: 'MCA_DEPT', description: 'Master of Computer Applications Department' },
    { name: 'M.Tech', code: 'MTECH_DEPT', description: 'Master of Technology Department' },
    { name: 'MBA', code: 'MBA_DEPT', description: 'Master of Business Administration Department' }
];

const importData = async () => {
    try {
        console.log('Seed: Upserting departments...');

        const deptMap = {};
        for (const deptData of departments) {
            const result = await Department.findOneAndUpdate(
                { code: deptData.code },
                deptData,
                { upsert: true, new: true }
            );
            deptMap[result.code] = result._id;
            console.log(`- ${result.name} (${result.code})`);
        }

        console.log('Seed: Adding courses for these departments...');
        const courses = [
            // Courses for B.Tech Dept
            { name: 'Computer Science (B.Tech)', code: 'BTECH-CS', department: deptMap['BTECH_DEPT'], duration: 8 },
            { name: 'Mechanical (B.Tech)', code: 'BTECH-ME', department: deptMap['BTECH_DEPT'], duration: 8 },
            { name: 'Electronics (B.Tech)', code: 'BTECH-EC', department: deptMap['BTECH_DEPT'], duration: 8 },

            // Courses for B.Sc Dept
            { name: 'Physics (B.Sc)', code: 'BSC-PHY', department: deptMap['BSC_DEPT'], duration: 6 },
            { name: 'Chemistry (B.Sc)', code: 'BSC-CHM', department: deptMap['BSC_DEPT'], duration: 6 },
            { name: 'Mathematics (B.Sc)', code: 'BSC-MAT', department: deptMap['BSC_DEPT'], duration: 6 },

            // Courses for B.Com Dept
            { name: 'Accounting & Finance', code: 'BCOM-AF', department: deptMap['BCOM_DEPT'], duration: 6 },
            { name: 'General Commerce', code: 'BCOM-GEN', department: deptMap['BCOM_DEPT'], duration: 6 },

            // Courses for BCA Dept
            { name: 'Bachelor of Comp Applications', code: 'BCA-GEN', department: deptMap['BCA_DEPT'], duration: 6 },

            // Courses for MBA Dept
            { name: 'Human Resources', code: 'MBA-HR', department: deptMap['MBA_DEPT'], duration: 4 },
            { name: 'Finance Management', code: 'MBA-FIN', department: deptMap['MBA_DEPT'], duration: 4 }
        ];

        for (const courseData of courses) {
            await Course.findOneAndUpdate(
                { code: courseData.code },
                courseData,
                { upsert: true, new: true }
            );
            console.log(`- Course: ${courseData.name} (${courseData.code})`);
        }

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Department.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
