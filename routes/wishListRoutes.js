const express = require('express')
const { AddToWishList, GetWIshListItems, RemoveFromWishList, EmptyWishList } = require('../controllers/WishListController')
const protect = require('../middlewares/protect')

const router = express.Router()

router.post('/add',protect,AddToWishList)

router.get('/all',protect,GetWIshListItems)

router.put('/remove',protect,RemoveFromWishList)

router.put('/empty',protect,EmptyWishList)


module.exports = router