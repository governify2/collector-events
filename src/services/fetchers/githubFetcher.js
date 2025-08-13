const logger = require('governify-commons').getLogger().tag('githubFetcher');
const fetcherUtils = require('../../utils/fetcherUtils.js');

const getInfo = (options) => {
  return new Promise((resolve, reject) => {
    fetcherUtils
      .requestWithHeaders(`${options.api.endpoint}`, { Authorization: options.api.token })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        logger.error('Error fetching data from github fetcher');
        reject(err);
      });
  });
};

module.exports = {
  getInfo,
};
