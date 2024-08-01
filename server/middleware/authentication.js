const jwt = require('jsonwebtoken')

function authentication(req, res, next) {
	const authHeader = req.headers.authorization || req.headers.authorization

	// If Authorization header exists and begins with 'Bearer' token
	if (authHeader?.startWith('Bearer')) {

		const token = authHeader.split(' ')[1] // Grab token from header

		// Verify jwt token
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
			if (err) { // If there's an error...
				req.user = {} // Set req.user to empty object
				return next()
			}
			// Find user with findByID, include decoded.id, and deselect password and refresh token (to keep info confidential)
			const user = await User.findByID(decoded.id).select({ password: 0, refresh_token: 0 }).exec()

			if (user) { // If user exists...
				// Assign req.user to user Object
				req.user = { ...user.toObject({ getters: true }) } // Set getters to true to make full name and id fields available
			} else {
				req.user = {} // Set req.user to empty object
			}
		})
	} else { // If not...
		req.user = {} // Set req.user to empty object
		return next()
	}
}
