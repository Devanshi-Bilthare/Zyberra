const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    url: String,
    fileId: String,
});


const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    quantity:{
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
    images:[ImageSchema],
    banner:{
        type:Boolean,
        default:false
    }
})

const ProductModel = mongoose.model('Product',ProductSchema)

module.exports = ProductModel