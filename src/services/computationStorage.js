const logger = require('governify-commons').getLogger().tag('computationStorage');
const fetcher = require('./fetcher.js');
const crypto = require('crypto');
const redisManager = require('../utils/redisManager.js');
const config = require('../config.js');

const REDIS_ACTIVATION = config.redis.REDIS_ACTIVATION;
const COMPUTATION_TTL = config.computationStorage.COMPUTATION_TTL;
const INMEMORY_TTL_REFRESH_INTERVAL = config.computationStorage.inMemory.INMEMORY_TTL_REFRESH_INTERVAL;

const inMemoryResults = {}; // InMemory storage for computations if Redis is not activated

const getAllCurrentComputations = async () => {
  try {
    if (REDIS_ACTIVATION === 'true') return await redisManager.getAllComputationsCache();
    return Object.values(inMemoryResults);
  } catch (err) {
    logger.error('Error fetching all current computations:', err);
  }
};

const deleteAllComputations = async () => {
  try {
    if (REDIS_ACTIVATION === 'true') return await redisManager.clearAllComputationsCache();
    Object.keys(inMemoryResults).forEach((key) => delete inMemoryResults[key]);
    return;
  } catch (err) {
    logger.error('Error deleting all computations:', err);
  }
};

const getComputationById = async (computationID) => {
  try {
    if (REDIS_ACTIVATION === 'true') {
      const result = await redisManager.getCache(`computation_${computationID}`);
      redisManager.delCache(`computation_${computationID}`);
      return result;
    }
    const result = inMemoryResults[computationID];
    if (result !== undefined && result !== null && (result.state === 'Completed' || result.state === 'Aborted')) {
      delete inMemoryResults[computationID];
    }
    return result;
  } catch (err) {
    logger.error(`Error getting computation with ID ${computationID}:`, err);
  }
};

const createComputation = (options) => {
  const id = crypto.randomBytes(8).toString('hex');
  const result = { id: id, state: 'In Progress' };
  if (REDIS_ACTIVATION === 'true') {
    redisManager.setCache(`computation_${id}`, result, COMPUTATION_TTL);
  } else {
    result.createdAt = Date.now();
    inMemoryResults[id] = result;
  }
  fetcher
    .fetchComputation(options)
    .then((data) => {
      delete options.api.token;
      const resultCompleted = { id, state: 'Completed', totalCount: data.length, computationRequestConfig: options, computation: data };
      if (REDIS_ACTIVATION === 'true') {
        redisManager.setCache(`computation_${id}`, resultCompleted, COMPUTATION_TTL);
      } else {
        resultCompleted.createdAt = Date.now();
        inMemoryResults[id] = resultCompleted;
      }
      logger.info(`Computation with id: ${id} completed successfully`);
    })
    .catch((err) => {
      delete options.api.token;
      const resultAborted = { id, state: 'Aborted', error: err.message, computationRequestConfig: options };
      if (REDIS_ACTIVATION === 'true') {
        redisManager.setCache(`computation_${id}`, resultAborted, COMPUTATION_TTL);
      } else {
        resultAborted.createdAt = Date.now();
        inMemoryResults[id] = resultAborted;
      }
      logger.error(`Computation with id: ${id} aborted due to error:`, err);
    });
  return result;
};

//Every INMEMORY_TTL_REFRESH_INTERVAL, computations in inMemoryResults that exceed the ttl will be deleted
if (REDIS_ACTIVATION !== 'true') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(inMemoryResults).forEach((key) => {
      if (now - inMemoryResults[key].createdAt > COMPUTATION_TTL * 1000) {
        delete inMemoryResults[key];
      }
    });
  }, INMEMORY_TTL_REFRESH_INTERVAL);
}

module.exports = {
  getComputationById,
  getAllCurrentComputations,
  deleteAllComputations,
  createComputation,
};
