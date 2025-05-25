const express = require('express')
const { Register, Login, ForgotPassword, ResetPassword, GetAllUsers } = require('../controllers/userController')

const router = express.Router()

router.post('/register',Register)

router.post('/login',Login)

router.post('/forgot-password', ForgotPassword);

router.post('/reset-password/:token', ResetPassword);

router.get('/all', GetAllUsers);


module.exports = router