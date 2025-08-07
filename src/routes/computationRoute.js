const express = require('express');
const computationController = require('../controllers/computationController.js');

const router = express.Router();

router.get('/computations', computationController.getAllCurrentComputations);
router.post('/computations', computationController.createComputation);
router.get('/computations/:id', computationController.getComputationById);

module.exports = router;
