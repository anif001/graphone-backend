const { Router } = require('express');
const { getAllProducts, getProductBySlug } = require('../controllers/products');
const validate = require('../middleware/validate');
const { productsList, slugParam } = require('../validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();

router.get('/', validate(productsList), cacheMiddleware(120), getAllProducts);
router.get('/:slug', validate(slugParam), cacheMiddleware(300), getProductBySlug);

module.exports = router;
