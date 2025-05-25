const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

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

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.status(200).json({ user, token });


    }catch(err){
        res.status(500).json({ message: 'Login failed', error: err.message });
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
    const resetTokenExpiry = Date.now() + 5 * 60 * 1000;

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

    console.log(resetToken)

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"ZYBERRA Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Reset Your ZYBERRA Account Password",
        html: `
            <p>Dear ${user.name || "User"},</p>

            <p>We received a request to reset the password for your ZYBERRA account associated with this email address.</p>

            <p>If you made this request, please click the link below to reset your password. This link is valid for only <strong>5 minutes</strong> and can only be used once:</p>

            <p><a href="${resetUrl}" target="_blank" style="color: #1a73e8;">Reset Your Password</a></p>

            <p>If you did not request a password reset, please ignore this message. Your account remains safe and secure.</p>

            <p>For security reasons, do not share this email or link with anyone.</p>

            <br/>

            <p>Warm regards,</p>
            <p><strong>ZYBERRA Support Team</strong></p>
            <hr />
            <small>This is an automated message. Please do not reply to this email.</small>
        `,
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

const GetAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

module.exports= {Register, Login,ForgotPassword, ResetPassword,GetAllUsers}