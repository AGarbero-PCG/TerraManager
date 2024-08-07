// server/controllers/landHoldingController.js
const LandHolding = require('../models/LandHolding');

// Get all land holdings
const getLandHoldings = async (req, res) => {
	try {
		const landHoldings = await LandHolding.find().populate('owner');
		res.json(landHoldings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a Land Holding by ID
const getLandHoldingById = async (req, res) => {
	try {
		const landHolding = await LandHolding.findById(req.params.id).populate('owner');
		if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
		res.json(landHolding);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create a new Land Holding
const createLandHolding = async (req, res) => {
	const landHolding = new LandHolding(req.body);
	try {
		const newLandHolding = await landHolding.save();
		res.status(201).json(newLandHolding);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Update a Land Holding by ID
const updateLandHolding = async (req, res) => {
	try {
		const landHolding = await LandHolding.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
		res.json(landHolding);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a Land Holding by ID
const deleteLandHolding = async (req, res) => {
	try {
		const landHolding = await LandHolding.findByIdAndDelete(req.params.id);
		if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
		res.json({ message: 'Land Holding deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getLandHoldings,
	getLandHoldingById,
	createLandHolding,
	updateLandHolding,
	deleteLandHolding,
};
