const logger = require('governify-commons').getLogger().tag('fetcher');

const githubFetcher = require('./fetchers/githubFetcher.js');

const fetchComputation = (options) => {
  return new Promise((resolve, reject) => {
    try {
      var result = [];
      switch (options.api.name) {
        case 'github':
          result = githubFetcher.getInfo(options);
          break;
      }
      resolve(result);
    } catch (err) {
      logger.error('Error fetching computation:', err.message);
      reject(err);
    }
  });
};

module.exports = {
  fetchComputation,
};
