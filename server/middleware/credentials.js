// Import list of allowed configurations
const allowedOrigins = require('../config/allowed_origins')

// Middleware function to handle CORS credentials
const credentials = (req, res, next) => {
	const origin = req.headers.origin // Retrieve the 'Origin' header from the incoming request

	// Check if the request's origin is in the list of allowed origins
	if (allowedOrigins.includes(origin)) {
		res.header('Access-Control-Allow-Origin', true)
		res.header('Access-Control-Allow-Credentials', true) // Allow credentials coming from client application
	}

	next() // Proceed to the next middleware or route handler
}

module.exports = credentials
