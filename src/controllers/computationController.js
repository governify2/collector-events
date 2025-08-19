const computationStorage = require('../services/computationStorage');
const { NotFoundError } = require('../utils/customErrors.js');
const logger = require('governify-commons').getLogger().tag('computationController');

const createComputation = (req, res, next) => {
  try {
    const options = req.body;
    const token = req.headers.token;
    options.api.token = token;
    logger.info(`Starting computation for ${options.api.name} API at endpoint ${options.api.endpoint}`);
    const newComputation = computationStorage.createComputation(options);
    logger.info(`Computation with id: ${newComputation.id} started successfully`);
    res.sendSuccess(newComputation, `Computation with id: ${newComputation.id} started successfully`, 201);
  } catch (error) {
    next(error);
  }
};

const getComputationById = async (req, res, next) => {
  try {
    const computationId = req.params.id;
    logger.info(`Getting computation with ID: ${computationId}`);
    const computation = await computationStorage.getComputationById(computationId);
    if (!computation) {
      logger.warn(`No computation found with ID: ${computationId}`);
      throw new NotFoundError(`No computation with the id ${computationId} was found.`);
    }
    if (computation.state === 'In Progress') {
      logger.info(`Computation with ID: ${computationId} is still in progress`);
      return res.sendSuccess(computation, `Computation with ID: ${computationId} is still in progress`, 202);
    }
    logger.info(`Computation with ID: ${computationId} retrieved successfully`);
    res.sendSuccess(computation, `Retrieving computation with id: ${computationId}`);
  } catch (error) {
    next(error);
  }
};

const getAllCurrentComputations = async (req, res, next) => {
  try {
    logger.info('Getting all current computations');
    const computations = await computationStorage.getAllCurrentComputations();
    logger.info(`Current computations fetched successfully. Total: ${computations.length}`);
    res.sendSuccess(computations, `Current computations fetched successfully. Total: ${computations.length}`);
  } catch (error) {
    next(error);
  }
};

const deleteAllComputations = async (req, res, next) => {
  try {
    logger.info('Deleting all computations');
    await computationStorage.deleteAllComputations();
    logger.info(`All computations deleted successfully.`);
    res.sendSuccess(null, `All computations deleted successfully.`);
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
