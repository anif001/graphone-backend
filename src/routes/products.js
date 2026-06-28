const { Router } = require('express');
const { getAllProducts, getProductBySlug } = require('../controllers/products');
const router = Router();
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
module.exports = router;
