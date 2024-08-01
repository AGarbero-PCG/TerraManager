// Routes regarding authentication and authorization
const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/authController');
const authentication = require('../../middleware/authentication');


router.post('/register', (req, res, next) => {
	console.log('Received request at /register');
	next();
}, authControllers.register) // Used for register

router.post('/login', (req, res, next) => {
	console.log('Received request at /login');
	next();
}, authControllers.login) // Used for login application

router.post('/logout', (req, res, next) => {
	console.log('Received request at /logout');
	next();
}, authControllers.logout) // Used for logout application

router.post('/refresh', (req, res, next) => {
	console.log('Received request at /refresh');
	next();
}, authControllers.refresh) // Used for refresh tokens

router.get('/user', (req, res, next) => {
	console.log('Received request at /user');
	next();
}, authentication, authControllers.user) // Used for getting user data

module.exports = router;
