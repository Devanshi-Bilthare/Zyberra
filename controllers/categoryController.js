const asyncHandler = require('express-async-handler');
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');


const AddCategory = asyncHandler(async (req,res)=>{
    try{

        const newCategory = await CategoryModel.create(req.body)

        res.status(201).json(newCategory)

    }catch(err){
        res.status(500).json({ message: 'Category is not Created', error: err.message });
    }
})

const AllCategory = asyncHandler(async (req,res)=>{
    try{
        const allCategories = await CategoryModel.find()
        res.status(201).json(allCategories)
    }catch(err){
        res.status(500).json({message:'Error in Fetching Category',error:err.message})
    }
})

const EditCategory = asyncHandler(async (req,res)=>{
    try{
        const {id} = req.params
        const updatdeCategory = await CategoryModel.findByIdAndUpdate(id,req.body)

        res.status(201).json(updatdeCategory)

    }catch(err){
        res.status(500).json({message:'Error in editing Category',error:err.message})
    }
})


const DeleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all products with this category
    await ProductModel.deleteMany({ category: id });

    // Then delete the category
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category and its products deleted successfully',
      deletedCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting category and its products',
      error: err.message,
    });
  }
});


const GetProductByCategory = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const category = await CategoryModel.findById(id).populate('products')

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ products: category.products });

    }catch(err){
        res.status(500).json({ message: 'Error fetching products of category', error: err.message });
    }
})

module.exports = {AddCategory,AllCategory,EditCategory,DeleteCategory,GetProductByCategory}