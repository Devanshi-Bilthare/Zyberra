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

        if (!user.cart) {
            user.cart = [];
        }

        // Check if product is already in cart
        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex !== -1) {
            // Product already in cart - increase quantity if within stock limit
            const currentQty = user.cart[cartItemIndex].quantity;

            if (currentQty >= product.quantity) {
                return res.status(400).json({ message: 'Cannot add more than available stock' });
            }

            user.cart[cartItemIndex].quantity += 1;
        } else {
            // Product not in cart - add with quantity 1
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error adding to cart', error: err.message });
    }
});


const GetCartItems = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).populate('cart.product');

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

        const index = user.cart.findIndex(item => item.product.toString() === productId);
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

const DecreaseCartQuantity = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const currentQty = user.cart[cartItemIndex].quantity;

        if (currentQty <= 1) {
            return res.status(400).json({ message: 'Quantity cannot be less than 1' });
        } else {
            user.cart[cartItemIndex].quantity -= 1;
        }

        await user.save();

        res.status(200).json({ message: 'Cart quantity decreased', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Error decreasing cart quantity', error: err.message });
    }
});


module.exports = {AddToCart,GetCartItems,RemoveFromCart,EmptyCart,DecreaseCartQuantity}