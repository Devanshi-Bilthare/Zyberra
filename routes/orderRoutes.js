const express = require('express')
const protect = require('../middlewares/protect');
const { createOrder, verifyPayment } = require('../controllers/OrderController');

const router = express.Router()


router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);


module.exports = router