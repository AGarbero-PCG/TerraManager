// server/models/Owner.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the Owner schema
const OwnerSchema = new Schema(
	{
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

		// Create array to store list of land holdings per owner
		land_holdings: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'LandHolding'
		}]
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

module.exports = mongoose.model('Owner', OwnerSchema);
