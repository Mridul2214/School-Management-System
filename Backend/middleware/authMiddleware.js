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

            if (token.startsWith('mock_token')) {
                // Bypass for development - Extracting dynamic ID and Role
                const parts = token.split('_');
                const mockId = parts[2] || '507f1f77bcf86cd799439011';
                const mockRole = parts[3] || 'Administrator';

                req.user = {
                    _id: mockId,
                    name: `Demo ${mockRole}`,
                    email: `${mockRole.toLowerCase()}@demo.com`,
                    role: mockRole,
                    isAdmin: mockRole === 'Administrator'
                };
                next();
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
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
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'Staff' || req.user.role === 'Administrator')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as staff');
    }
};

module.exports = { protect, admin, staff };
