// server/controllers/landHoldingController.js
const LandHolding = require('../models/LandHolding');
const Owner = require('../models/Owner');

// Create a new Land Holding
async function createLandHolding(req, res) {
	console.log('Inside createLandHolding controller');
	console.log('Request body:', req.body);
	try {

		const {
			owner,
			legal_entity,
			net_mineral_acres,
			mineral_owner_royalty,
			section,
			township,
			range,
			title_source
		} = req.body;

		// Check if all required fields are present
		if (
			owner == null ||
			!legal_entity ||
			net_mineral_acres == null ||
			mineral_owner_royalty == null ||
			!section ||
			!township ||
			!range ||
			!title_source
		) {
			return res.status(422).json({ 'message': 'Missing required fields' });
		}


		const ownerExists = await Owner.findById(owner).exec();
		if (!ownerExists) {
			return res.status(404).json({ 'message': 'Owner does not exist' });
		}
		console.log('Owner exists:', ownerExists);

		// Auto-generate the name and section_name fields
		const section_name = `${section}-${township}-${range}`;
		const name = `${section_name}-${legal_entity}`;

		// Create new land holding
		const newLandHolding = await LandHolding.create({
			name,
			owner,
			legal_entity,
			net_mineral_acres,
			mineral_owner_royalty,
			section,
			section_name,
			township,
			range,
			title_source,
		});

		// Update the owner with the new land holding
		ownerExists.land_holdings.push(newLandHolding._id);

		// Save the updated owner
		await ownerExists.save();
		console.log('Updated Owner:', ownerExists);

		return res.status(201).json({ message: 'Land Holding created successfully', landHolding: newLandHolding });


	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all Land Holdings for a specific owner
async function getLandHoldings(req, res) {
	console.log('Inside getLandHoldings controller');
	try {
		const { ownerId } = req.params; // Extract ownerId from request parameters
		const landHoldings = await LandHolding.find({ owner: ownerId })
			.populate('owner', 'name') // Include only specific fields from the owner

		if (!landHoldings || landHoldings.length === 0) {
			return res.status(200).json({ message: 'No land holdings found for this owner' });
		}
		res.json(landHoldings);
		console.log('Successfully returned Land Holdings for this owner');
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


// Get a Land Holding by ID
async function getLandHoldingById(req, res) {
	console.log('Inside getLandHoldingById controller');
	try {
		const landHolding = await LandHolding.findById(req.params.id).populate('owner');

		if (!landHolding) return res.status(404).json({ message: 'Land Holding not found' });

		res.status(200).json(landHolding);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching Land Holding by ID:' });
	}
};

// Update a Land Holding by ID
async function updateLandHolding(req, res) {
	console.log('Inside updateLandHolding controller');
	try {
		const landHolding = await LandHolding.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!landHolding) {
			console.log('Land Holding not found');

			return res.status(404).json({ message: 'Land Holding not found' })
		};
		res.json(landHolding);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a Land Holding by ID
async function deleteLandHolding(req, res) {
	console.log('Inside deleteLandHolding controller');
	try {
		const landHolding = await LandHolding.findByIdAndDelete(req.params.id);
		if (!landHolding) {
			return res.status(404).json({ message: 'Land Holding not found' });
		}
		// Update total_land_holdings
		ownerExists.total_land_holdings = ownerExists.land_holdings.length;
		res.json({ message: 'Land Holding deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createLandHolding,
	getLandHoldings,
	getLandHoldingById,
	updateLandHolding,
	deleteLandHolding,
};
