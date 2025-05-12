const express = require('express')
const { Register, Login, ForgotPassword, ResetPassword } = require('../controllers/userController')

const router = express.Router()

router.post('/register',Register)

router.post('/login',Login)

router.post('/forgot-password', ForgotPassword);

router.post('/reset-password/:token', ResetPassword);

module.exports = router