const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
})

const CategoryModel = mongoose.model('Category',CategorySchema)

module.exports = CategoryModel