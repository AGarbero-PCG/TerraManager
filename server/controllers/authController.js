const User = require('../models/User') // Import User model
const jwt = require('jsonwebtoken') // To generate JWT tokens
const bcrypt = require('bcrypt') // To hash passwords



async function register(req, res) {
	const { username, email, first_name, last_name, password, password_confirm } = req.body // Validation of these fields will be done by Mongoose

	// Check if all required fields are present
	if (!username || !email || !password || !password_confirm || !first_name || !last_name) {
		return res.status(422).json({ 'message': 'Invalid fields' })
	}

	// Check if passwords match
	if (password !== password_confirm) {
		return res.status(422).json({ 'message': 'Passwords do not match' })
	}

	const userExists = await User.exists({ email }).exec() // Check if user already exists in database

	if (userExists) return res.status(409) // If yes, return error

	// If not, hash the password
	try {
		hashedPassword = await bcrypt.hash(password, 10)
		await User.create({ email, username, password: hashedPassword, first_name, last_name }) // Create user
		return res.sendStatus(201) // Send response 201 (Created status)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: 'Internal server error' })
	}
}

async function login(req, res) {
	res.sendStatus(200)
}

async function logout(req, res) {
	res.sendStatus(200)
}

async function refresh(req, res) {
	res.sendStatus(200)
}

async function user(req, res) {
	res.sendStatus(200)
}

module.exports = { register, login, logout, refresh, user }
