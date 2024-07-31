require('dotenv').config

const express = require('express') // Call Express.js from node modules
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const corsOptions = require('./config/cors')
const connectDB = require('./config/database')
const credentials = require('./middleware/credentials')
const errorHandlerMiddleware = require('./middleware/error_handler')


const app = express() // Contains Express app
const PORT = 3500 // Specify PORT to be 3500 for the app to run on

connectDB()

// Allow Credentials
app.use(credentials)

// CORS
app.use(cors(corsOptions))

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// Application/json response
app.use(express.json())

// Middleware for cookies
app.use(cookieParser())

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// Default error handler
app.use(errorHandlerMiddleware)

// Routes
app.use('./api/auth', require('./routes/api/auth'))

// Default handler for false routes (routes not defined in the application)
app.all('*', (req, res) => {
	res.sendStatus(404)
})

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) }) // Listen to the port and see that the app is running
