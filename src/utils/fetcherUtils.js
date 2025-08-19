const axios = require('axios');
const logger = require('governify-commons').getLogger().tag('fetcherUtils');

const defaultOptions = {
  method: 'GET',
  headers: {},
};

const requestWithHeaders = (url, extraHeaders, data = undefined) => {
  return new Promise((resolve, reject) => {
    const options = { ...defaultOptions };
    options.headers = { ...defaultOptions.headers };

    const extraHeaderKeys = Object.keys(extraHeaders);
    for (const key of extraHeaderKeys) {
      options.headers[key] = extraHeaders[key];
    }

    if (data) {
      options.method = 'POST';
      options.data = data;
    }

    options.url = url;

    axios(options)
      .then((response) => resolve(response.data))
      .catch((error) => {
        logger.error('Error in request with headers');
        reject(error);
      });
  });
};

module.exports = {
  requestWithHeaders,
};
