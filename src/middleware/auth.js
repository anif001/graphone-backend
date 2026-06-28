const config = require('../config');
const ApiError = require('../utils/ApiError');

const AUTH_TOKEN = config.nodeEnv === 'production'
  ? (process.env.API_AUTH_TOKEN || null)
  : 'graphone-dev-token';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required. Provide Bearer token in Authorization header.');
  }

  const token = authHeader.split(' ')[1];

  if (!AUTH_TOKEN || token !== AUTH_TOKEN) {
    throw new ApiError(401, 'Invalid or expired authentication token.');
  }

  req.user = { role: 'admin', token: 'authenticated' };
  next();
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (AUTH_TOKEN && token === AUTH_TOKEN) {
      req.user = { role: 'admin', token: 'authenticated' };
    }
  }
  next();
};

module.exports = { authMiddleware, optionalAuth };
