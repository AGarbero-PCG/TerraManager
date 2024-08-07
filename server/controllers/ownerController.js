const Owner = require('../models/Owner');
const LandHolding = require('../models/LandHolding');

const getOwners = async (req, res) => {
	try {
		const owners = await Owner.find();
		res.json(owners);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getOwnerById = async (req, res) => {
	try {
		const owner = await Owner.findById(req.params.id);
		if (!owner) return res.status(404).json({ message: 'Owner not found' });
		res.json(owner);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createOwner = async (req, res) => {
	const owner = newOwner(req.body);
	try {
		const newOwner = await owner.save();
		res.status(201).json(newOwner);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const updateOwner = async (req, res) => {
	try {
		const owner = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!owner) return res.status(404).json({ message: 'Owner not found' });
		res.json(owner);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteOwner = async (req, res) => {
	try {
		const owner = await Owner.findByIdAndDelete(req.params.id);
		if (!owner) return res.status(404).json({ message: 'Owner not found' });

		// Delete related Land Holdings
		await LandHolding.deleteMany({ owner: req.params.id });

		res.json({ message: 'Owner and related Land Holdings deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.export = {
	getOwners,
	getOwnerById,
	createOwner,
	updateOwner,
	deleteOwner,
};