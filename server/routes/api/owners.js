// server/routes/api/owners.js
const express = require('express');
const router = express.Router();
const Owner = require('../../models/Owner');
const ownerControllers = require('../../controllers/ownerController');

// Endpoints for creating, reading, updating, and deleting owners

// Create a new Owner
router.post('/createOwner', async (req, res) => {
	console.log('Received request at /createOwner');
	const createOwner = new Owner(req.body)
	try {
		const owner = await createOwner.save()
		if (!owner) throw new Error('There was an error saving the new owner')
		res.status(200).json(todo)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Get all Owners
router.get('/getOwners', async (req, res) => {
	console.log('Received request at /getOwners');
	try {
		const ownerList = await Owner.find()
		if (!ownerList) throw new Error('No owners available')
		res.status(200).json(ownerList)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Get Owner by ID
router.get('/getOwner/:id', async (req, res) => {
	console.log('Received request at /getOwnerById');
	try {
		const ownerUnique = await Owner.findById(id)
		if (!ownerUnique) throw new Error('No owners available')
		res.status(200).json(ownerUnique)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Update Owner by ID
router.put('/updateOwner/:id', async (req, res) => {
	console.log('Received request at /updateOwner');
	const updateOwner = new Owner(req.body)
	try {
		const owner = await updateOwner.findByIdandUpdate(id)
		if (!owner) throw new Error('There was an error updating the new owner')
		res.status(200).json(owner)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// Delete Owner by ID
router.delete('/deleteOwner/:id', async (req, res) => {
	console.log('Received request at /deleteOwner');
	try {
		const deleteOwner = await Owner.findByIdAndDelete(id)
		if (!deleteOwner) throw Error('Could not delete owner')
		res.status(200).json(deleteOwner)
	} catch {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router;
