// server/controllers/landHoldingController.js
const LandHolding = require('../models/LandHolding');

// Create a new Land Holding
async function createLandHolding(req, res) {
	res.sendStatus(200)
	console.log('Inside create land holding controller');
	const { owner, legal_entity, net_mineral_acres, mineral_owner_royalty, section, township, range, title_source } = req.body;
	console.log('Request body:', req.body);

	// Check if all required fields are present
	if (!owner || !legal_entity || !net_mineral_acres || !mineral_owner_royalty || !section || !township || !range || !title_source) {
		return res.status(422).json({ 'message': 'Invalid fields' });
	}

	// Create a new land holding instance
	try {
		await LandHolding.create({ owner, legal_entity, net_mineral_acres, mineral_owner_royalty, section, township, range, title_source });
		console.log('Land Holding created successfully');

		return res.sendStatus(201).json({ 'message': 'Land Holding created successfully' }); // Send response 201 (Created status)
	} catch (error) {
		console.error('Error creating Land Holding:', error);
		return res.status(400).json({ 'message': 'Could not create Land Holding' });
	}
};

// Get all land holdings
const getLandHoldings = async (req, res) => {
	res.sendStatus(200)
	// try {
	// 	const landHoldings = await LandHolding.find().populate('owner');
	// 	res.json(landHoldings);
	// } catch (error) {
	// 	res.status(500).json({ message: error.message });
	// }
};

// Get a Land Holding by ID
const getLandHoldingById = async (req, res) => {
	res.sendStatus(200)
	// try {
	// 	const landHolding = await LandHolding.findById(req.params.id).populate('owner');
	// 	if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
	// 	res.json(landHolding);
	// } catch (error) {
	// 	res.status(500).json({ message: error.message });
	// }
};

// Update a Land Holding by ID
const updateLandHolding = async (req, res) => {
	res.sendStatus(200)
	// try {
	// 	const landHolding = await LandHolding.findByIdAndUpdate(req.params.id, req.body, { new: true });
	// 	if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
	// 	res.json(landHolding);
	// } catch (error) {
	// 	res.status(400).json({ message: error.message });
	// }
};

// Delete a Land Holding by ID
const deleteLandHolding = async (req, res) => {
	res.sendStatus(200)
	// try {
	// 	const landHolding = await LandHolding.findByIdAndDelete(req.params.id);
	// 	if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });
	// 	res.json({ message: 'Land Holding deleted' });
	// } catch (error) {
	// 	res.status(500).json({ message: error.message });
	// }
};

module.exports = {
	createLandHolding,
	getLandHoldings,
	getLandHoldingById,
	updateLandHolding,
	deleteLandHolding,
};
