const dotenv = require('dotenv').config('./.env')
const express = require('express')

const dbConnect = require('./config/dbConnect')
dbConnect()

const app = express()
const cors = require('cors')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const UserRouter  =require('./routes/userRoutes')

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())


app.use('/api/user',UserRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT,() => {
    console.log(`server running on ${process.env.PORT}`)
})    