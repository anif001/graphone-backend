const { Router } = require('express');
const { getFeed } = require('../controllers/feed');
const validate = require('../middleware/validate');
const { pagination } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(pagination), cacheMiddleware(60), getFeed);

module.exports = router;
