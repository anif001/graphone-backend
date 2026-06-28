const { Router } = require('express');
const { getAllCompanies, getCompanyBySlug } = require('../controllers/companies');
const validate = require('../middleware/validate');
const { companiesList, slugParam } = require('../validators');

const router = Router();

router.get('/', validate(companiesList), getAllCompanies);
router.get('/:slug', validate(slugParam), getCompanyBySlug);

module.exports = router;
