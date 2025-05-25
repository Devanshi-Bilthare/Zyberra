const express = require('express')
const protect = require('../middlewares/protect');
const adminProtect = require('../middlewares/adminProtect')
const { createOrder, verifyPayment, allOrders, getStats } = require('../controllers/OrderController');

const router = express.Router()


router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);

router.get('/all', adminProtect ,allOrders );
router.get('/stats', adminProtect ,getStats );




module.exports = router