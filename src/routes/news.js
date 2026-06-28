const { Router } = require('express');
const { getAllNews, getNewsBySlug } = require('../controllers/news');
const router = Router();
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);
module.exports = router;
