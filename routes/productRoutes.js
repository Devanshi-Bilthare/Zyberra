const express = require('express')
const { AddProduct, GetAllProducts, GetSingleProduct, EditProduct, DeleteProduct } = require('../controllers/productController')

const router = express.Router()

router.post('/add',AddProduct)

router.get('/all',GetAllProducts)

router.get('/:id',GetSingleProduct)

router.put('/edit/:id',EditProduct)

router.delete('/delete/:id',DeleteProduct)


module.exports = router