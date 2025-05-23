const express = require('express')
const { AddToCart, RemoveFromCart, GetCartItems, EmptyCart, DecreaseCartQuantity } = require('../controllers/CartController')
const protect = require('../middlewares/protect')

const router = express.Router()

router.post('/add',protect,AddToCart)

router.get('/all',protect,GetCartItems)

router.put('/remove',protect,RemoveFromCart)

router.put('/decrease',protect,DecreaseCartQuantity)


router.put('/empty',protect,EmptyCart)



module.exports = router