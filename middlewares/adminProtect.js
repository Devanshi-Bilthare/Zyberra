const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

const adminProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await UserModel.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401);
                throw new Error('User not found');
            }


            if (user.role !== 'admin') {
                // Return here directly to avoid hitting catch
                res.status(403);
                throw new Error('Not authorized as admin');
            }

            req.user = user;
            next();
        } catch (err) {
            // If res.statusCode is not manually set before, default to 401
            if (!res.statusCode || res.statusCode === 200) {
                res.status(401);
            }
            throw new Error(err.message || 'Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = adminProtect;
