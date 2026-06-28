const { Router } = require('express');
const { getAllNews, getNewsBySlug } = require('../controllers/news');
const validate = require('../middleware/validate');
const { newsList, slugParam } = require('../validators');

const router = Router();

router.get('/', validate(newsList), getAllNews);
router.get('/:slug', validate(slugParam), getNewsBySlug);

module.exports = router;
