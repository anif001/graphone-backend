const { Router } = require('express');
const { getAllFounders, getFounderBySlug } = require('../controllers/founders');
const validate = require('../middleware/validate');
const { foundersList, slugParam } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(foundersList), cacheMiddleware(120), getAllFounders);
router.get('/:slug', validate(slugParam), cacheMiddleware(300), getFounderBySlug);

module.exports = router;
