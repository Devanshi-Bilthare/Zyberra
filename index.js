const dotenv = require('dotenv').config('./.env')
const express = require('express')
const fileUpload = require('express-fileupload')

const dbConnect = require('./config/dbConnect')
dbConnect()

const app = express()
const cors = require('cors')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const UserRouter  =require('./routes/userRoutes')
const CategoryRouter = require('./routes/categoryRoutes')
const ProductRouter = require('./routes/productRoutes')
const CartRouter = require('./routes/cartRoutes')
const WishListRouter = require('./routes/wishListRoutes')
const OrderRouter = require('./routes/orderRoutes')

app.use(morgan('dev'))
app.use(cors())

app.use(fileUpload({
    useTempFiles:false,
    limits:{fileSize:10*1024*1024}
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())


app.use('/api/user',UserRouter)
app.use('/api/category',CategoryRouter)
app.use('/api/product',ProductRouter)
app.use('/api/cart',CartRouter)
app.use('/api/wishlist',WishListRouter)
app.use('/api/order',OrderRouter)




app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT,() => {
    console.log(`server running on ${process.env.PORT}`)
})    