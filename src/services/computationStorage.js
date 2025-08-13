const logger = require('governify-commons').getLogger().tag('computationStorage');
const fetcher = require('./fetcher.js');
const crypto = require('crypto');

const results = {};

const getAllCurrentComputations = () => {
  try {
    return Object.values(results);
  } catch (err) {
    logger.error('Error fetching all current computations:', err);
  }
};

const deleteAllComputations = () => {
  try {
    const computationsDeleted = Object.keys(results).length;
    Object.keys(results).forEach((key) => delete results[key]);
    return computationsDeleted;
  } catch (err) {
    logger.error('Error deleting all computations:', err);
  }
};

const getComputationById = (computationID) => {
  try {
    result = results[computationID];
    if (result !== undefined && result !== null && (result.state === 'Completed' || result.state === 'Aborted')) {
      delete results[computationID];
    }
    return result;
  } catch (err) {
    logger.error(`Error getting computation with ID ${computationID}:`, err);
  }
};

const createComputation = (options) => {
  const id = crypto.randomBytes(8).toString('hex');
  results[id] = { id, state: 'In Progress' };
  fetcher
    .fetchComputation(options)
    .then((data) => {
      delete options.api.token;
      results[id] = { id, state: 'Completed', totalCount: data.length, computationRequestConfig: options, computation: data };
      logger.info(`Computation with id: ${id} completed successfully`);
    })
    .catch((err) => {
      delete options.api.token;
      results[id] = { id, state: 'Aborted', error: err.message, computationRequestConfig: options };
      logger.error(`Computation with id: ${id} aborted due to error:`, err);
    });
  return results[id];
};

module.exports = {
  getComputationById,
  getAllCurrentComputations,
  deleteAllComputations,
  createComputation,
};
