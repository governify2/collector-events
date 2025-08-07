const logger = require('governify-commons').getLogger().tag('computationStorage');

const results = {};

results['60c72b2f9b1d8f0d8d0b6f9e'] = {
  id: '60c72b2f9b1d8f0d8d0b6f9e',
  name: 'a Name',
  result: 42,
};

const getAllCurrentComputations = () => {
  try {
    return Object.values(results);
  } catch (err) {
    logger.error('Error fetching all current computations:', err);
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
    throw err;
  }
};

module.exports = {
  getComputation,
  getAllCurrentComputations,
};
