require('dotenv').config();

const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS for handling cross-origin requests
const cookieParser = require('cookie-parser'); // Import cookie-parser for handling cookies
const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions
const path = require('path'); // Import path for handling and transforming file paths
const corsOptions = require('./config/cors'); // Import CORS configuration
const connectDB = require('./config/database'); // Import database connection configuration
const credentials = require('./middleware/credentials'); // Import credentials middleware
const errorHandlerMiddleware = require('./middleware/error_handler'); // Import error handler middleware
const { log } = require('console');

const app = express(); // Contains Express app
const PORT = process.env.PORT || 3500; // Specify PORT to be 3500 for the app to run on

connectDB();

// Allow credentials middleware
app.use(credentials)

// CORS middleware
app.use(cors(corsOptions))

// Middleware to handle URL-encoded data
app.use(express.urlencoded({ extended: false }))

// Middleware to handle JSON data
app.use(express.json())

// Middleware to handle cookies
app.use(cookieParser())

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// Default error handler
app.use(errorHandlerMiddleware)

// Routes
console.log('Setting up routes...');
app.use('/api/auth', require('./routes/api/auth'))

// Additional routes for LandHolding and Owner models
app.use('/api/landholdings', require('./routes/api/landholdings'));
app.use('/api/owners', require('./routes/api/owners'));

// Default handler for undefined routes
app.all('*', (req, res) => {
	res.sendStatus(404)
})

// DB Connection
mongoose.connection.once('open', () => { // Makes sure we only open the app once the database connection is complete
	console.log('Database connected successfully')
	app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) }) // Listen to the port and see that the app is running
})
