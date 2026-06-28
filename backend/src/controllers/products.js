const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const productsService = require('../services/products');

const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, sort: sortBy = 'name', order: sortOrder = 'asc' } = req.query;
  const result = await productsService.findAll({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    search, category,
    sortBy,
    sortOrder,
  });
  res.json(new ApiResponse(200, {
    products: result.data, total: result.total, page: result.page, limit: result.limit,
  }));
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productsService.findBySlug(slug);
  if (!product) throw new ApiError(404, `Product not found: ${slug}`);
  res.json(new ApiResponse(200, { product }));
});

module.exports = { getAllProducts, getProductBySlug };
