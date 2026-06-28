const { Router } = require('express');
const { getAllFounders, getFounderBySlug } = require('../controllers/founders');
const validate = require('../middleware/validate');
const { foundersList, slugParam } = require('../validators');

const router = Router();

router.get('/', validate(foundersList), getAllFounders);
router.get('/:slug', validate(slugParam), getFounderBySlug);

module.exports = router;
