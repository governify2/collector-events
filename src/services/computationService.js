'use strict';

const logger = require('governify-commons').getLogger().tag('computationService');
const { NotFoundError, ValidationError } = require('../utils/customErrors.js');
const { getComputation } = require('./computationStorage.js');

function getComputationById(computationId) {
  try {
    const computation = getComputation(computationId);

    if (computation === null) {
      // Not ready yet
      const error = new ValidationError('Not ready yet.');
      error.statusCode = 202;
      throw error;
    } else if (computation === undefined) {
      // Not found
      throw new NotFoundError('No computation with this id was found.');
    } else if (typeof computation === 'object') {
      // OK
      return computation;
    } else if (typeof computation === 'string') {
      // Bad request
      throw new ValidationError(computation);
    } else {
      // Internal server error
      const error = new Error('Internal server error.');
      error.statusCode = 500;
      throw error;
    }
  } catch (err) {
    logger.error('Error getting computation by ID (getComputationById):', err);
    throw err;
  }
}

module.exports = {
  getComputationById,
};
