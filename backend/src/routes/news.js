const { Router } = require('express');
const { getAllNews, getNewsBySlug } = require('../controllers/news');
const validate = require('../middleware/validate');
const { newsList, slugParam } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(newsList), cacheMiddleware(60), getAllNews);
router.get('/:slug', validate(slugParam), cacheMiddleware(120), getNewsBySlug);

module.exports = router;
