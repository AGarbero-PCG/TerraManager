// Routes regarding authentication and authorization
const express = require('express')
const router = express.Router()


router.post('/register') // Used for register

router.post('/login',) // Used for login application

router.post('/logout') // Used for logout application

router.post('/refresh') // Used for refresh tokens

router.get('/user') // Used for getting user data

module.exports = router
