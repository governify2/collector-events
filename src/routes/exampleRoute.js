const express = require('express');
const exampleController = require('../controllers/exampleController.js');
const { validateExample } = require('../middlewares/exampleValidator.js');

const router = express.Router();

// Define routes
router.get('/v1/examples', exampleController.getAllExamples);
router.post('/v1/examples', validateExample, exampleController.createExample);
router.get('/v1/examples/:id', exampleController.getExampleById);
router.put('/v1/examples/:id', validateExample, exampleController.updateExample);
router.delete('/v1/examples/:id', exampleController.deleteExample);

module.exports = router;
