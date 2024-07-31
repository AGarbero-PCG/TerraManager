const mongoose = require('mongoose');

const landHoldingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    legalEntity: { type: String, required: true },
    netMineralAcres: { type: Number, required: true },
    mineralOwnerRoyalty: { type: Number, required: true },
    sectionName: { type: String, required: true },
    titleSource: { type: String, required: true, enum: ['Class A', 'Class B', 'Class C', 'Class D'] },
});

const LandHolding = mongoose.model('LandHolding', landHoldingSchema);

module.exports = LandHolding;
