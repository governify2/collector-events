const computationService = require('../services/computationService');
const computationStorage = require('../services/computationStorage');
const { NotFoundError } = require('../utils/customErrors.js');
const logger = require('governify-commons').getLogger().tag('computationController');

const createComputation = (req, res, next) => {
  try {
    const newComputation = computationService.createComputation(req.body);
    logger.info(`Creating computation with id: ${newComputation._id}`);
    res.sendSuccess(newComputation, 'Computation with ', 201);
  } catch (error) {
    next(error);
  }
};

const getComputationById = (req, res, next) => {
  try {
    const computationId = req.params.id;
    logger.info(`Getting computation with ID: ${computationId}`);
    const computation = computationService.getComputationById(computationId);
    if (!computation) throw new NotFoundError('Computation not found');
    res.sendSuccess(computation, `Retrieving computation with id: ${computationId}`);
  } catch (error) {
    next(error);
  }
};

const getAllCurrentComputations = (req, res, next) => {
  try {
    logger.info('Getting all current computations');
    const computations = computationStorage.getAllCurrentComputations();
    res.sendSuccess(computations, 'Current computations fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComputation,
  getComputationById,
  getAllCurrentComputations,
};
