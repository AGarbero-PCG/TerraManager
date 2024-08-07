// server/controllers/ownerController.js
const Owner = require('../models/Owner');
const LandHolding = require('../models/LandHolding');

// Create a new Owner
async function createOwner(req, res) {
	console.log('Inside create owner controller');
	const { name, entity_type, owner_type, address, total_land_holdings } = req.body;
	console.log('Request body:', req.body);

	// Check if all required fields are present
	if (!name || !entity_type || !owner_type || !address || !total_land_holdings) {
		return res.status(422).json({ 'message': 'All fields are required' });
	}

	// Check if owner already exists in database
	const ownerExists = await Owner.exists({ name }).exec();
	// If owner exists, return error
	if (ownerExists) {
		return res.status(409).json({ 'message': 'Owner with this name already exists' });
	}

	// Check if address already exists in database
	const addressExists = await Owner.exists({ address }).exec();
	// If owner exists, return error
	if (addressExists) {
		return res.status(409).json({ 'message': 'Owner with this address already exists' });
	}

	// Create a new owner
	try {
		await Owner.create({ name, entity_type, owner_type, address, total_land_holdings });
		console.log('Owner created successfully');

		return res.sendStatus(201).json({ 'message': 'Owner created successfully' }); // Send response 201 (Created status)
	} catch (error) {
		console.error('Error creating Owner:', error);
		return res.status(500).json({ 'message': 'Internal server error' });
	}
}



// Get all Owners
async function getOwners(req, res) {
	try {
		const owners = await Owner.find();
		res.json(owners);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get an Owner by ID
async function getOwnerById(req, res) {
	try {
		const owner = await Owner.findById(req.params.id);

		if (!owner) return res.status(404).json({ message: 'Owner not found' });

		res.json(owner);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


// Update an Owner by ID
async function updateOwner(req, res) {
	try {
		const owner = await Owner.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' });
		}
		res.json(owner);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete an Owner by ID
async function deleteOwner(req, res) {
	try {
		const owner = await Owner.findByIdAndDelete(req.params.id);
		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' });
		}
		// Delete related Land Holdings
		await LandHolding.deleteMany({ owner: req.params.id });

		res.json({ message: 'Owner and related Land Holdings deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createOwner,
	getOwners,
	getOwnerById,
	updateOwner,
	deleteOwner,
};
