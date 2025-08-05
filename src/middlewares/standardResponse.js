const { sendError, sendSuccess } = require('../utils/standardResponse.js');
const standardResponseMiddleware = (req, res, next) => {
  /**
   * Send a success response with a standard format
   * @param {Object} data - The data to send
   * @param {string} [message='Success!'] - The message to send
   * @param {number} [statusCode=200] - The status code to send
   * @param {string} [appCode='OK'] - The application code
   * @returns {void}
   * @example
   * res.sendSuccess({ name: 'John Doe' });
   */
  res.sendSuccess = (data, message = 'Success!', statusCode = 200, appCode = 'OK') => {
    sendSuccess(res, data, message, statusCode, appCode);
  };

  /**
   * Send an error response with a standard format
   * @param {Error} error - The error object
   * @returns {void}
   * @example
   * res.sendError(new AppError('Resource not found', 404));
   */
  res.sendError = (error) => {
    sendError(res, error);
  };

  next();
};

module.exports = standardResponseMiddleware;
