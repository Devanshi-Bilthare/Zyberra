const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      priceAtPurchase: Number, 
    },
  ],
  orderId: String,         
  paymentId: String,       
  amount: Number,           
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
},{timestamps:true});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel
