const config = require('../config.js');
const { sendError } = require('../utils/standardResponse.js');

const errorHandler = (error, req, res, next) => {
  sendError(res, error);
};

module.exports = errorHandler;
