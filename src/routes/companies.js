const { Router } = require('express');
const { getAllCompanies, getCompanyBySlug } = require('../controllers/companies');

const router = Router();

router.get('/', getAllCompanies);
router.get('/:slug', getCompanyBySlug);

module.exports = router;
