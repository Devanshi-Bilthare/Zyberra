const express = require('express')
const { AddCategory, EditCategory, AllCategory, DeleteCategory, GetProductByCategory } = require('../controllers/categoryController')

const router = express.Router()

router.post('/add',AddCategory)

router.get('/all',AllCategory)

router.put('/edit/:id',EditCategory)

router.delete('/delete/:id',DeleteCategory)

router.get('/:id/products',GetProductByCategory)


module.exports = router