const { Router } = require('express');
const { getTrending } = require('../controllers/trending');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', cacheMiddleware(180), getTrending);

module.exports = router;
