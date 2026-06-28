const config = require('../config');

const cache = require('node-cache');

const responseCache = new cache({ stdTTL: 60, checkperiod: 120 });

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    if (config.nodeEnv === 'test') return next();

    const key = `cache:${req.originalUrl}`;
    const cached = responseCache.get(key);
    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      responseCache.set(key, body, duration || 60);
      originalJson(body);
    };
    next();
  };
};

const clearCache = (pattern) => {
  const keys = responseCache.keys();
  for (const key of keys) {
    if (key.includes(pattern)) {
      responseCache.del(key);
    }
  }
};

module.exports = { cacheMiddleware, clearCache, responseCache };
