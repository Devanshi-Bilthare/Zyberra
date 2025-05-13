const asyncHandler = require('express-async-handler');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');

const AddToCart = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await UserModel.findById(userId);

        const alreadyInCart = user.cart.includes(productId);
        if (alreadyInCart) {
            return res.status(400).json({ message: 'Product already in cart' });
        }

        user.cart.push(productId);
        await user.save();

        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error adding to cart', error: err.message });
    }
});

const GetCartItems = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).populate('cart');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cart items', error: err.message });
    }
});

const RemoveFromCart = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.cart.indexOf(productId);
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        user.cart.splice(index, 1);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error removing from cart', error: err.message });
    }
});


const EmptyCart = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId)

        user.cart = [];

        await user.save();

        res.status(200).json({ message: 'Cart is now empty', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error emptying cart', error: err.message });
    }
});


module.exports = {AddToCart,GetCartItems,RemoveFromCart,EmptyCart}