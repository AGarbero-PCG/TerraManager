// server/routes/api/landholdings.js
const express = require('express');
const router = express.Router();
const landHoldingController = require('../../controllers/landHoldingController');

router.post('/createLandHolding/:id', (req, res, next) => {
	console.log('Received request at /createLandHolding');
	next();
}, landHoldingController.createLandHolding);

router.get('/getLandHoldings', (req, res, next) => {
	console.log('Received request at /getLandHoldings');
	next();
}, landHoldingController.getLandHoldings);

router.get('/getLandHoldingById/:id', (req, res, next) => {
	console.log('Received request at /getLandHoldingById');
	next();
}, landHoldingController.getLandHoldingById);

router.put('/updateLandHolding/:id', (req, res, next) => {
	console.log('Received request at /updateLandHolding');
	next();
}, landHoldingController.updateLandHolding);

router.delete('/deleteLandHolding/:id', (req, res, next) => {
	console.log('Received request at /deleteLandHolding');
	next();
}, landHoldingController.deleteLandHolding);

module.exports = router;
