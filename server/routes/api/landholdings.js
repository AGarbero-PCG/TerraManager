// server/routes/api/landholdings.js
const express = require('express');
const router = express.Router();
const landHoldingController = require('../../controllers/landHoldingController');

router.get('/', landHoldingController.getLandHoldings);
router.get('/:id', landHoldingController.getLandHoldingById);
router.post('/', landHoldingController.createLandHolding);
router.put('/:id', landHoldingController.updateLandHolding);
router.delete('/:id', landHoldingController.deleteLandHolding);

module.exports = router;
