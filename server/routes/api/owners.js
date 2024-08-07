// server/routes/api/owners.js
const express = require('express');
const router = express.Router();
const ownerControllers = require('../../controllers/ownerController');

router.post('/createOwner', (req, res, next) => {
	console.log('Received request at /createOwner');
	next();
}, ownerControllers.createOwner)

router.get('/getOwners', (req, res, next) => {
	console.log('Received request at /getOwners');
	next();
}, ownerControllers.getOwners)

router.get('/getOwner/:id', (req, res, next) => {
	console.log('Received request at /getOwnerById');
	next();
}, ownerControllers.getOwnerById)

router.put('/updateOwner/:id', (req, res, next) => {
	console.log('Received request at /updateOwner');
	next();
}, ownerControllers.updateOwner)

router.delete('/deleteOwner/:id', (req, res, next) => {
	console.log('Received request at /deleteOwner');
	next();
}, ownerControllers.deleteOwner)

module.exports = router;
