const asyncHandler = require('express-async-handler');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');

const AddToWishList = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await UserModel.findById(userId);

        const alreadyInWishList = user.wishList.includes(productId);
        if (alreadyInWishList) {
            return res.status(400).json({ message: 'Product already in WishList' });
        }

        user.wishList.push(productId);
        await user.save();

        res.status(200).json({ message: 'Product added to wishList', wishList: user.wishList });
    } catch (err) {
        res.status(500).json({ message: 'Error adding to wishList', error: err.message });
    }
});

const GetWIshListItems = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).populate('wishList');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ wishList: user.wishList });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wishList items', error: err.message });
    }
});

const RemoveFromWishList = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.wishList.indexOf(productId);
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found in wishList' });
        }

        user.wishList.splice(index, 1);
        await user.save();

        res.status(200).json({ message: 'Product removed from wishList', wishList: user.wishList });
    } catch (err) {
        res.status(500).json({ message: 'Error removing from wishList', error: err.message });
    }
});


const EmptyWishList = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId)

        user.wishList = [];

        await user.save();

        res.status(200).json({ message: 'WishList is now empty', wishList: user.wishList });
    } catch (err) {
        res.status(500).json({ message: 'Error emptying wishList', error: err.message });
    }
});


module.exports = {AddToWishList,GetWIshListItems,RemoveFromWishList,EmptyWishList}