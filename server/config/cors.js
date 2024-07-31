const allowedOrigins = require('./allowed_origins') // Import list of allowed origins

// Configuration for CORS
const corsOptions = {
	// Determine if request's origin is allowed
	origin: (origin, callback) => {
		// Check if request's origin is in list of allowed origins || no origin, such as same-origin requests or ones made by tools like 'curl'
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

module.exports = corsOptions
