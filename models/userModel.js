const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
    type: String,
    trim: true, 
  },
  email: {
    type: String,
    unique: true, 
    lowercase: true, 
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'], 
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'], 
  },
  role:{
    type:String,
    default:'User'
  },
  cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  },

  wishList:{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  },

  ordered:{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  },

  resetToken: {
    type: String,
},
resetTokenExpiry: {
    type: Date,
},

},{timestamps:true})

const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel