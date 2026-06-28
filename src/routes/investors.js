const { Router } = require('express');
const { getAllInvestors, getInvestorBySlug } = require('../controllers/investors');
const validate = require('../middleware/validate');
const { investorsList, slugParam } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(investorsList), cacheMiddleware(120), getAllInvestors);
router.get('/:slug', validate(slugParam), cacheMiddleware(300), getInvestorBySlug);

module.exports = router;
