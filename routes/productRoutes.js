const express = require('express')
const { AddProduct, GetAllProducts, GetSingleProduct, EditProduct, DeleteProduct } = require('../controllers/productController')
const adminProtect = require('../middlewares/adminProtect')

const router = express.Router()

router.post('/add',adminProtect,AddProduct)

router.get('/all',GetAllProducts)

router.get('/:id',GetSingleProduct)

router.put('/edit/:id',adminProtect,EditProduct)

router.delete('/delete/:id',adminProtect,DeleteProduct)


module.exports = router