const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,  // Ensuring unique owner name
	},
	entity_type: {
		type: String,
		enum: ['Company', 'Individual', 'Investor', 'Trust'],
		required: true,
	},
	owner_type: {
		type: String,
		enum: ['Competitor', 'Seller', 'Investor', 'Professional'],
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	total_land_holdings: {
		type: Number,
		default: 0,
	},
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

module.exports = mongoose.model('Owner', OwnerSchema);