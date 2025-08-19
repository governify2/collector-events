const governify = require('governify-commons');
const logger = governify.getLogger().tag('redisManager');
const redis = require('redis');
const config = require('../config');

const redisUrl = governify.infrastructure.getServiceURL('internal.database.redis-ec');
const client = redis.createClient({ url: redisUrl });

const MAX_RETRIES = config.redis.REDIS_MAX_RETRIES;
const RETRY_DELAY_MS = config.redis.REDIS_RETRY_DELAY_MS;
const REDIS_ACTIVATION = config.redis.REDIS_ACTIVATION;

// Redis initial connection with retry logic
let retries = 0;
let isConnected = false;
let reconnectionStrategyAvailable = true;
let destroyFlag = false;
let errorMessageAvailable = true;

const connectWithRetry = () => {
  if (isConnected || destroyFlag) return;
  client
    .connect()
    .then(() => {
      if (destroyFlag) return;
      logger.info(`Redis client connected with url ${redisUrl}`);
      reconnectionStrategyAvailable = false;
      isConnected = true;
    })
    .catch(() => {
      if (isConnected || destroyFlag) return;
      retries++;
      if (errorMessageAvailable) {
        logger.error(`Redis client connection error`);
        errorMessageAvailable = false;
      }
      if (retries < MAX_RETRIES) {
        setTimeout(connectWithRetry, RETRY_DELAY_MS);
        logger.warn(`Retrying Redis connection with url ${redisUrl}... (attempt ${retries})`);
      } else {
        destroyFlag = true;
        client.destroy();
        logger.error(`Max Redis connection attempts reached for url ${redisUrl}. In memory store will be used`);
      }
    });
};

if (REDIS_ACTIVATION === 'true') {
  connectWithRetry();
} else {
  logger.info(`Redis activation is disabled. In-memory store will be used.`);
}

client.on('error', () => {
  if (REDIS_ACTIVATION === 'true' && reconnectionStrategyAvailable && !destroyFlag) {
    isConnected = false;
    connectWithRetry();
    reconnectionStrategyAvailable = false;
  }
  if (isConnected) {
    logger.warn(`Redis client closed.`);
    client.destroy();
  }
});

// Cache management functions
const setCache = (key, value, ttl = 300) => {
  return new Promise((resolve, reject) => {
    const stringValue = JSON.stringify(value);
    client
      .set(key, stringValue, { EX: ttl })
      .then(() => resolve())
      .catch((err) => {
        logger.error(`Error setting cache for key ${key}:`, err);
        reject(err);
      });
  });
};

const getCache = async (key) => {
  try {
    const value = await client.get(key);
    return JSON.parse(value);
  } catch (err) {
    logger.error(`Error getting cache for key ${key}:`, err);
  }
};

const delCache = (key) => {
  return client.del(key).catch((err) => {
    logger.error(`Error deleting cache for key ${key}:`, err);
  });
};

const clearAllComputationsCache = async () => {
  try {
    const keys = await client.keys('computation_*');
    await Promise.all(keys.map((key) => client.del(key)));
  } catch (err) {
    logger.error(`Error clearing cache:`, err);
  }
};

const getAllComputationsCache = async () => {
  const keys = await client.keys('computation_*');
  const values = await Promise.all(keys.map((key) => client.get(key)));
  return values.map((value) => JSON.parse(value));
};

module.exports = {
  setCache,
  getCache,
  delCache,
  clearAllComputationsCache,
  getAllComputationsCache,
};
