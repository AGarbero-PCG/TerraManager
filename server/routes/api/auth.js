// Routes regarding authentication and authorization
const express = require('express')
const router = express.Router()
const authControllers = require('../../controllers/authController')


router.post('/register', authControllers.register) // Used for register

router.post('/login', authControllers.login) // Used for login application

router.post('/logout', authControllers.logout) // Used for logout application

router.post('/refresh', authControllers.refresh) // Used for refresh tokens

router.get('/user', authControllers.login) // Used for getting user data

module.exports = router
