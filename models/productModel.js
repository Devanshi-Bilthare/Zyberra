const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    Quantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    description:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    image:{
        type:String
    }
})

const ProductModel = mongoose.model('Product',ProductSchema)

module.exports = ProductModel