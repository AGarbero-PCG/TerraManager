// server/routes/api/owners.js
const express = require('express');
const router = express.Router();
const ownerControllers = require('../../controllers/ownerController');

router.post('/createOwner', (req, res, next) => {
	console.log('Received request at /createOwner');
	next();
}, ownerControllers.createOwner)

router.post('/getOwners', (req, res, next) => {
	console.log('Received request at /getOwners');
	next();
}, ownerControllers.getOwners)

router.post('/getOwnerById', (req, res, next) => {
	console.log('Received request at /getOwnerById');
	next();
}, ownerControllers.getOwnerById)

router.post('/updateOwner', (req, res, next) => {
	console.log('Received request at /updateOwner');
	next();
}, ownerControllers.updateOwner)

router.get('/deleteOwner', (req, res, next) => {
	console.log('Received request at /deleteOwner');
	next();
}, ownerControllers.deleteOwner)

module.exports = router;
