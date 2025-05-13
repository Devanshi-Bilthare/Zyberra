const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
  cart:[{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  }],

  wishList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'Product'
  }],

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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel