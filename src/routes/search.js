const { Router } = require('express');
const { searchAll } = require('../controllers/search');
const validate = require('../middleware/validate');
const { searchQuery } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(searchQuery), cacheMiddleware(60), searchAll);

module.exports = router;
