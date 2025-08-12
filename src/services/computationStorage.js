const logger = require('governify-commons').getLogger().tag('computationStorage');
const fetcher = require('./fetcher.js');
const crypto = require('crypto');

const results = {};

const getAllCurrentComputations = () => {
  try {
    return Object.values(results);
  } catch (err) {
    logger.error('Error fetching all current computations:', err);
    throw err;
  }
};

const deleteAllComputations = () => {
  try {
    const computationsDeleted = Object.keys(results).length;
    Object.keys(results).forEach((key) => delete results[key]);
    return computationsDeleted;
  } catch (err) {
    logger.error('Error deleting all computations:', err);
    throw err;
  }
};

const getComputation = (computationID) => {
  try {
    const result = results[computationID];
    if (result !== undefined && result !== null) {
      delete results[computationID];
    }
    return result;
  } catch (err) {
    logger.error(`Error getting computation with ID ${computationID}:`, err);
    throw err;
  }
};

const createComputation = (options) => {
  try {
    const id = crypto.randomBytes(8).toString('hex');
    const computation = fetcher.fetchComputation(options);
    results[id] = { id, computation };
    return results[id];
  } catch (err) {
    logger.error('Error creating computation:', err);
    throw err;
  }
};

module.exports = {
  getComputation,
  getAllCurrentComputations,
  deleteAllComputations,
  createComputation,
};
