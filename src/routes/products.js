const { Router } = require('express');
const { getAllProducts, getProductBySlug } = require('../controllers/products');
const validate = require('../middleware/validate');
const { productsList, slugParam } = require('../validators');

const router = Router();

router.get('/', validate(productsList), getAllProducts);
router.get('/:slug', validate(slugParam), getProductBySlug);

module.exports = router;
