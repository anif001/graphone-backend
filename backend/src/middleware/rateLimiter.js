const rateLimit = require('express-rate-limit');
const config = require('../config');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 100 : 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
