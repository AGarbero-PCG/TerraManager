const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandHoldingSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,  // Ensuring unique name for Land Holdings
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Owner',
		required: true,
	},
	legal_entity: {
		type: String,
		required: true,
	},
	net_mineral_acres: {
		type: Number,
		required: true,
	},
	mineral_owner_royalty: {
		type: Number,
		required: true,
	},
	section_name: {
		type: String,
		required: true,
	},
	section: {
		type: String,
		required: true,
		validate: [
			(val) => /^\d{3}$/.test(val),
			'Section should be exactly 3 numeric characters',
		],
	},
	township: {
		type: String,
		required: true,
		validate: [
			(val) => /^\d{3}[NS]$/.test(val),
			'Township should be 3 numeric characters followed by N or S',
		],
	},
	range: {
		type: String,
		required: true,
		validate: [
			(val) => /^\d{3}[EW]$/.test(val),
			'Range should be 3 numeric characters followed by E or W',
		],
	},
	title_source: {
		type: String,
		enum: ['Class A', 'Class B', 'Class C', 'Class D'],
		required: true,
	},
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

module.exports = mongoose.model('LandHolding', LandHoldingSchema);
