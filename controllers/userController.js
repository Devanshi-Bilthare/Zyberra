const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const nodemailer = require('nodemailer')

const Register = asyncHandler(async (req,res)=>{
    try{
        const newUser = await UserModel.create(req.body)
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'3d'})

        res.status(201).json({newUser,token})

    }catch(err){
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
})

const Login = asyncHandler(async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            res.status(400)
            throw new Error('Please provide both email and password')
        }

    }catch(err){
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
})

const ForgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide an email');
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; 

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetUrl = `http://yourfrontend.com/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>Hello ${user.name || ''},</p>
               <p>Click the link below to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
});

const ResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
});

module.exports= {Register, Login,ForgotPassword, ResetPassword}