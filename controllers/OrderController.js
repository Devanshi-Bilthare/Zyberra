const Razorpay = require('razorpay');
const OrderModel = require('../models/orderModel');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const ProductModel = require('../models/productModel');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId).populate('cart.product');

  if (!user || !user.cart.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let totalAmount = 0;

  const products = user.cart.map(item => {
    const price = item.product.price;
    totalAmount += price * item.quantity;

    return {
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: price,
    };
  });

  // Razorpay amount must be in paisa (e.g., ₹100 = 10000)
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  });

  const newOrder = await OrderModel.create({
    user: userId,
    products,
    amount: totalAmount,
    currency: 'INR',
    orderId: razorpayOrder.id,
    status: 'created',
  });

  res.status(201).json({
    message: 'Razorpay order created',
    order: newOrder,
    razorpayOrder,
    key: process.env.RAZORPAY_KEY_ID,
  });
});


const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  const order = await OrderModel.findOne({ orderId: razorpay_order_id });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Update order status
  order.paymentId = razorpay_payment_id;
  order.status = 'paid';
  await order.save();

  // 1. Decrease product stock quantities
  for (const item of order.products) {
    await ProductModel.findByIdAndUpdate(
      item.product,
      { $inc: { quantity: -item.quantity } }, // decrease quantity
      { new: true }
    );
  }

  // 2. Empty user's cart
  await UserModel.findByIdAndUpdate(order.user, { $set: { cart: [] } });

  res.status(200).json({ message: 'Payment verified successfully', order });
});

module.exports = {createOrder,verifyPayment}
