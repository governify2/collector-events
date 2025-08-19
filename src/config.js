const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const config = {
  server: {
    serverPort: process.env.PORT || 5500,
    env: process.env.NODE_ENV || 'development',
  },
  fetcher: {
    pseudonymizerUrl: process.env.PSEUDONYMIZER_URL || null,
    keyScopeManager: process.env.KEY_SCOPE_MANAGER || null,
    keyGithub: process.env.KEY_GITHUB || null,
    keyPivotal: process.env.KEY_PIVOTAL || null,
    keyHeroku: process.env.KEY_HEROKU || null,
    keyTravisPublic: process.env.KEY_TRAVIS_PUBLIC || null,
    keyTravisPrivate: process.env.KEY_TRAVIS_PRIVATE || null,
    keyCodeclimate: process.env.KEY_CODECLIMATE || null,
    keyPseudonymizer: process.env.KEY_PSEUDONYMIZER || null,
    keyGitlab: process.env.KEY_GITLAB || null,
    keyRedmine: process.env.KEY_REDMINE || null,
    keyJira: process.env.KEY_JIRA || null,
  },
  computationStorage: {
    COMPUTATION_TTL: process.env.COMPUTATION_TTL || 300, // 5 minutes
    inMemory: {
      INMEMORY_TTL_REFRESH_INTERVAL: process.env.INMEMORY_TTL_REFRESH_INTERVAL || 10000, // 10 seconds
    },
  },
  redis: {
    REDIS_ACTIVATION: process.env.REDIS_ACTIVATION || 'true',
    REDIS_MAX_RETRIES: process.env.REDIS_MAX_RETRIES || 10,
    REDIS_RETRY_DELAY_MS: process.env.REDIS_RETRY_DELAY_MS || 1000, // 1 second
  },
};

module.exports = config;
