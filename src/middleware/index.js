const config = require('../config');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
    details = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res) => {
  throw new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = { errorHandler, notFoundHandler };
