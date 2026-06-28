const { Router } = require('express');
const { getAllCompanies, getCompanyBySlug } = require('../controllers/companies');
const validate = require('../middleware/validate');
const { companiesList, slugParam } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(companiesList), cacheMiddleware(120), getAllCompanies);
router.get('/:slug', validate(slugParam), cacheMiddleware(300), getCompanyBySlug);

module.exports = router;
