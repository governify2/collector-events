const stdOptions = {
  codes: {
    success: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    internalServerError: 500,
  },
  appCodes: {
    ok: 'OK',
    unknownError: 'UNKNOWN_ERROR',
    notFound: 'NOT_FOUND',
    badRequest: 'BAD_REQUEST',
    validationError: 'VALIDATION_ERROR',
    unauthorized: 'UNAUTHORIZED',
    forbidden: 'FORBIDDEN',
    internalServerError: 'INTERNAL_SERVER_ERROR',
  },
  status: {
    success: 'success', // 2xx
    failed: 'failed', // 4xx
    error: 'error', // 5xx
  },
};

function sendSuccess(res, data, message = 'Success!', statusCode = stdOptions.codes.success, appCode = stdOptions.appCodes.ok) {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    appCode,
    timestamp: new Date().toISOString(),
  });
  return;
}

function sendError(res, error) {
  let statusCode = error.statusCode;
  let message = error.message;
  let details = error;
  let appCode = error.appCode;

  if (!appCode) {
    // If the error object does not have an appCode its an unknown error
    appCode = stdOptions.appCodes.unknownError;
    statusCode = stdOptions.codes.internalServerError;
  } else {
    delete details.appCode;
    delete details.statusCode;
  }

  res.status(statusCode).json({
    status: statusCode < 500 ? 'failed' : 'error',
    message,
    details,
    appCode,
    statusCode,
    timestamp: new Date().toISOString(),
  });
  return;
}

module.exports = { sendError, sendSuccess, stdOptions };
