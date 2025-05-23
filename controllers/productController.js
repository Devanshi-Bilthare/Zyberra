const asyncHandler = require('express-async-handler');
const ProductModel = require('../models/productModel');
const imagekit = require('../config/imageKit');
const CategoryModel = require('../models/categoryModel');


const AddProduct = asyncHandler(async (req, res) => {
    try {
        const { name, quantity, price, description, category,banner } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }


        if (!req.files || !req.files.images) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        const imageFiles = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images];

        const imageUrls = [];

        for (const file of imageFiles) {
            const uploadResponse = await imagekit.upload({
                file: file.data, 
                fileName: file.name,
            });
            imageUrls.push({
                url:uploadResponse.url,
                fileId:uploadResponse.fileId
            });
        }

        const newProduct = await ProductModel.create({
            name,
            quantity,
            price,
            description,
            category,
            images: imageUrls,
            banner
        });

        await CategoryModel.findByIdAndUpdate(category, {
            $push: { products: newProduct._id }
        });

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Product creation failed', error: err.message });
    }
});

const GetAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await ProductModel.find().populate('category');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

const GetSingleProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id).populate('category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
});

const EditProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let updatedImages = existingProduct.images;

        // If new images uploaded, replace old ones
        if (req.files && req.files.images) {
            // Delete old images from ImageKit
            const deletePromises = existingProduct.images.map(img =>
                imagekit.deleteFile(img.fileId)
            );
            await Promise.all(deletePromises);

            const imageFiles = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images];

            updatedImages = [];

            for (const file of imageFiles) {
                const uploadResponse = await imagekit.upload({
                    file: file.data,
                    fileName: file.name,
                });
                updatedImages.push({
                    url: uploadResponse.url,
                    fileId: uploadResponse.fileId,
                });
            }
        }

        const oldCategoryId = existingProduct.category?.toString();
        const newCategoryId = req.body.category;

        // Update product with new data and images
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                images: updatedImages,
            },
            { new: true }
        );

        // Handle category change
        if (newCategoryId && oldCategoryId !== newCategoryId) {
            if (oldCategoryId) {
                await CategoryModel.findByIdAndUpdate(oldCategoryId, {
                    $pull: { products: id }
                });
            }

            await CategoryModel.findByIdAndUpdate(newCategoryId, {
                $addToSet: { products: id }
            });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});




const DeleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const deletePromises = product.images.map(img =>
            imagekit.deleteFile(img.fileId)
        );
        await Promise.all(deletePromises);

        await CategoryModel.findByIdAndUpdate(product.category, {
            $pull: { products: product._id }
        });

        await ProductModel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product and images deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});



module.exports ={AddProduct,GetAllProducts,GetSingleProduct,EditProduct,DeleteProduct}