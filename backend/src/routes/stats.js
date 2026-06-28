const { Router } = require('express');
const { getStats } = require('../controllers/stats');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', cacheMiddleware(600), getStats);

module.exports = router;
