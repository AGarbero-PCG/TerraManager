const User = require('../models/User') // Import User model
const jwt = require('jsonwebtoken') // To generate JWT tokens
const bcrypt = require('bcrypt') // To hash passwords



async function register(req, res) {
	console.log('Inside register controller');
	const { username, email, first_name, last_name, password, password_confirm } = req.body // Validation of these fields will be done by Mongoose
	console.log('Request body:', req.body);

	// Check if all required fields are present
	if (!username || !email || !password || !password_confirm || !first_name || !last_name) {
		return res.status(422).json({ 'message': 'Invalid fields' })
	}

	// Check if passwords match
	if (password !== password_confirm) {
		return res.status(422).json({ 'message': 'Passwords do not match' })
	}

	const userExists = await User.exists({ email }).exec() // Check if user already exists in database

	// If yes, return error
	if (userExists) {
		return res.status(409).json({ 'message': 'User already exists' });
	}

	// If not, hash the password
	try {
		hashedPassword = await bcrypt.hash(password, 10)
		await User.create({ email, username, password: hashedPassword, first_name, last_name }) // Create user
		console.log('User created successfully');
		return res.sendStatus(201) // Send response 201 (Created status)
	} catch (error) {
		console.error('Error creating user:', error)
		return res.status(500).json({ message: 'Internal server error' })
	}
}

async function login(req, res) {
	console.log('Inside login controller');
	res.sendStatus(200)
}

async function logout(req, res) {
	console.log('Inside logout controller');
	res.sendStatus(200)
}

async function refresh(req, res) {
	console.log('Inside refresh controller');
	res.sendStatus(200)
}

async function user(req, res) {
	console.log('Inside user controller');
	res.sendStatus(200)
}

module.exports = { register, login, logout, refresh, user }
