const { stdOptions } = require('./standardResponse.js');

class NotFoundError extends Error {
  constructor(message = 'Resource not found', details) {
    super('[EXCEPTION]: ' + message);
    this.details = details;
    this.appCode = stdOptions.appCodes.notFound;
    this.statusCode = stdOptions.codes.notFound;
  }
}

class ValidationError extends Error {
  constructor(message = 'Validation failed', details) {
    super('[EXCEPTION]: ' + message);
    this.details = details;
    this.appCode = stdOptions.appCodes.validationError;
    this.statusCode = stdOptions.codes.badRequest;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized', details) {
    super('[EXCEPTION]: ' + message);
    this.details = details;
    this.appCode = stdOptions.appCodes.unauthorized;
    this.statusCode = stdOptions.codes.unauthorized;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden', details) {
    super('[EXCEPTION]: ' + message);
    this.details = details;
    this.appCode = stdOptions.appCodes.forbidden;
    this.statusCode = stdOptions.codes.forbidden;
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
};
