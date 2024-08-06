// This file sets the authenticated user to a request as a parameter
// This is done so that we can use the request user parameter in any controller

const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authentication(req, res, next) {
	const authHeader = req.headers.authorization || req.headers.Authorization

	// If Authorization header exists and begins with 'Bearer' token
	if (authHeader?.startsWith('Bearer ')) {

		const token = authHeader.split(' ')[1] // Grab token from header

		// Verify jwt token
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
			if (err) { // If there's an error...
				req.user = {} // Set req.user to empty object
				console.log('Token verification failed:', err);
				return next();
			}
			// Find user with findByID, include decoded.id, and deselect password and refresh token (to keep info confidential)
			const user = await User.findById(decoded.id).select({ password: 0, refresh_token: 0 }).exec()

			if (user) { // If user exists...
				// Assign req.user to user Object
				req.user = user.toObject({ getters: true }); // Set getters to true to make full name and id fields available
				console.log('User set in req:', req.user);
			} else {
				req.user = {} // Set req.user to empty object
				console.log('User not found in database')
			}
			return next();
		})
	} else { // If Authorization header DOES NOT exist and begin with 'Bearer' token
		req.user = {} // Set req.user to empty object
		console.log('No authorization header found');
		return next();
	}
}

module.exports = authentication;
