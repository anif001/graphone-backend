const { Router } = require('express');
const { getAllFounders, getFounderBySlug } = require('../controllers/founders');
const router = Router();
router.get('/', getAllFounders);
router.get('/:slug', getFounderBySlug);
module.exports = router;
