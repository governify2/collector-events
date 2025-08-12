const computationService = require('../services/computationService');
const computationStorage = require('../services/computationStorage');
const { NotFoundError } = require('../utils/customErrors.js');
const logger = require('governify-commons').getLogger().tag('computationController');

const createComputation = (req, res, next) => {
  try {
    logger.info('Creating a new computation');
    const newComputation = computationStorage.createComputation(req.body);
    logger.info(`Creating computation with id: ${newComputation.id}`);
    res.sendSuccess(newComputation, `Computation with id: ${newComputation.id} created successfully`, 201);
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
    logger.info(`Computation with ID: ${computationId} retrieved successfully`);
    res.sendSuccess(computation, `Retrieving computation with id: ${computationId}`);
  } catch (error) {
    next(error);
  }
};

const getAllCurrentComputations = (req, res, next) => {
  try {
    logger.info('Getting all current computations');
    const computations = computationStorage.getAllCurrentComputations();
    logger.info(`Current computations fetched successfully. Total: ${computations.length}`);
    res.sendSuccess(computations, `Current computations fetched successfully. Total: ${computations.length}`);
  } catch (error) {
    next(error);
  }
};

const deleteAllComputations = (req, res, next) => {
  try {
    logger.info('Deleting all computations');
    const computationsDeleted = computationStorage.deleteAllComputations();
    logger.info(`All computations deleted successfully. Total deleted: ${computationsDeleted}`);
    res.sendSuccess(null, `All computations deleted successfully. Total deleted: ${computationsDeleted}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComputation,
  getComputationById,
  getAllCurrentComputations,
  deleteAllComputations,
};
