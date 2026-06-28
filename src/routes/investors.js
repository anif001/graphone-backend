const { Router } = require('express');
const { getAllInvestors, getInvestorBySlug } = require('../controllers/investors');

const router = Router();

router.get('/', getAllInvestors);
router.get('/:slug', getInvestorBySlug);

module.exports = router;
