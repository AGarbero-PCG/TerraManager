const User = require('../models/User') // Import User model
const jwt = require('jsonwebtoken') // To generate JWT tokens
const bcrypt = require('bcrypt') // To hash passwords


// Register a new user
async function register(req, res) {
	console.log('Inside register controller');
	const { username, email, first_name, last_name, password, password_confirm } = req.body // Validation of these fields will be done by Mongoose
	console.log('Request body:', req.body);

	// Check if all required fields are present
	if (!username || !email || !password || !password_confirm || !first_name || !last_name) {
		return res.status(422).json({ 'message': 'Invalid fields' });
	}

	// Check if passwords match
	if (password !== password_confirm) {
		return res.status(422).json({ 'message': 'Passwords do not match' });
	}

	// Check if user already exists in database
	const userExists = await User.exists({ email }).exec();

	// If user exists, return error
	if (userExists) {
		return res.status(409).json({ 'message': 'User already exists' });
	}

	// If not, hash the password
	try {
		hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		await User.create({ email, username, password: hashedPassword, first_name, last_name });
		console.log('User created successfully');

		return res.sendStatus(201).json({ 'message': 'User created successfully' }); // Send response 201 (Created status)
	} catch (error) {
		console.error('Error creating user:', error);
		return res.status(400).json({ 'message': 'Could not register user' });
	}
}

// User login
async function login(req, res) {
	console.log('Inside login controller');
	const { email, password } = req.body // Extract email and password from request body

	// Check if all required fields are present
	if (!email || !password) {
		return res.status(422).json({ 'message': 'Invalid fields' });
	}

	// Find the user by email
	const user = await User.findOne({ email }).exec();

	// Check if user is in database
	if (!user) return res.status(401).json({ 'message': 'No users with this email exist' })

	// Check if passwords match using bcrypt
	const match = await bcrypt.compare(password, user.password)
	if (!match) return res.status(401).json({ 'message': 'Email or password is incorrect' })

	// Generate access token
	const accessToken = jwt.sign(
		{
			id: user.id
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: '1800s' // Expires in 30 min
		}
	)

	// Generate refresh token
	const refreshToken = jwt.sign(
		{
			id: user.id
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: '1d' // Expires in 1 day
		}
	)

	// Save refresh token with the user
	user.refresh_token = refreshToken;
	await user.save();

	// Set the refresh token as an HTTP-only cookie
	res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 1000, sameSite: 'None', secure: true }) // Refresh token will expire after 1 day

	console.log('User logged in successfully:', user.first_name, user.last_name);
	res.json({ message: 'User logged in successfully: ' + user.first_name + ' ' + user.last_name, access_token: accessToken })
}

// User logout
async function logout(req, res) {
	console.log('Inside logout controller');
	const cookies = req.cookies; // Get cookie
	if (!cookies.refresh_token) return res.sendStatus(204); // If there is no cookie, send a No Content response

	const refreshToken = cookies.refresh_token; // Get refresh token
	const user = await User.findOne({ refresh_token: refreshToken }).exec(); // Access user from database through refresh token

	// If the user does not exist in database, clear the cookie
	if (!user) {
		res.clearCookie('refresh token', { httpOnly: true, sameSite: 'None', secure: true }); // Note: sameSite means we will be able to use our cookies between cross-origin requests (e.g. we will be able to use cookies between the client and our server).
		return res.sendStatus(204);
	}

	// If the user exists in database...
	user.refresh_token = null; // Nullify refresh token
	await user.save(); // Save the user

	res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
}

// Refresh controller
async function refresh(req, res) {
	console.log('Inside refresh controller');
	const cookies = req.cookies // Get cookie

	// If refresh token doesn't exist in our cookie...
	if (!cookies.refresh_token) return res.sendStatus(401) // Send unauthenticated response

	const refreshToken = cookies.refresh_token // Grab refresh token

	const user = await User.findOne({ refresh_token: refreshToken }).exec() // Use refresh token to find user

	// If the user doesn't exist...
	if (!user) return res.sendStatus(403) // Send unauthorized response

	// Verify refresh token
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			// Check if user is the same as the decoded user in the database
			// Set username to 'id' to preserve uniqueness, and so that it can't be duplicated
			if (err || user.id !== decoded.id) return res.sendStatus(403) // If not, send unauthorized response

			const accessToken = jwt.sign(
				{ id: decoded.id },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '1800s' }
			)

			res.json({ access_token: accessToken })
		}
	)

}

// Get user data
async function user(req, res) {
	console.log('Inside user controller');
	console.log('req.user:', req.user);

	const user = req.user;

	return res.status(200).json({ user });
}

module.exports = {
	register,
	login,
	logout,
	refresh,
	user
};
