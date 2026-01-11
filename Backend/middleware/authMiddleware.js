const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log(`Auth Middleware: Received token: ${token}`); // Debug log

            // Mock token bypass removed to enforce real authentication
            /*
           if (token.startsWith('mock_token')) {
               // ... removed
           } 
           */

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('Decoded Token:', decoded);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('User not found in DB with ID:', decoded.id);
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // console.log('Auth Success. User Role:', req.user.role);

            next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Administrator') {
        next();
    } else {
        console.log(`Access Denied. User: ${req.user?.email}, Role: ${req.user?.role}`);
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'Staff' || req.user.role === 'Administrator')) {
        next();
    } else {
        console.log(`Access Denied (Staff). User: ${req.user?.email}, Role: ${req.user?.role}`);
        res.status(401).json({ message: 'Not authorized as staff' });
    }
};

module.exports = { protect, admin, staff };
