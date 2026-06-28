const { Router } = require('express');
const { getAllInvestors, getInvestorBySlug } = require('../controllers/investors');
const validate = require('../middleware/validate');
const { investorsList, slugParam } = require('../validators');

const router = Router();

router.get('/', validate(investorsList), getAllInvestors);
router.get('/:slug', validate(slugParam), getInvestorBySlug);

module.exports = router;
