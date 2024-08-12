// server/routes/api/owners.js
const express = require('express');
const router = express.Router();
const Owner = require('../../models/Owner');
const ownerControllers = require('../../controllers/ownerController');

// Endpoints for creating, reading, updating, and deleting owners

// Create a new Owner
router.post('/createOwner', async (req, res, next) => {
	console.log('Received request at /createOwner');
	next();
}, ownerControllers.createOwner)

// Get all Owners
router.get('/getOwners', async (req, res, next) => {
	console.log('Received request at /getOwners');
	next();
}, ownerControllers.getOwners)

// Get Owner by ID
router.get('/getOwner/:id', async (req, res, next) => {
	console.log('Received request at /getOwnerById');
	next();
}, ownerControllers.getOwnerById)

// Update Owner by ID
router.put('/updateOwner/:id', async (req, res, next) => {
	console.log('Received request at /updateOwner');
	next();
}, ownerControllers.updateOwner)

// Delete Owner by ID
router.delete('/deleteOwner/:id', async (req, res, next) => {
	console.log('Received request at /deleteOwner');
	next();
}, ownerControllers.deleteOwner)

module.exports = router;
