const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const foundersService = require('../services/founders');

const getAllFounders = asyncHandler(async (req, res) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;
  const result = await foundersService.findAll({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    search,
    sortBy: sortBy || 'name',
    sortOrder: sortOrder || 'asc',
  });
  res.json(new ApiResponse(200, {
    founders: result.data, total: result.total, page: result.page, limit: result.limit,
  }));
});

const getFounderBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const founder = await foundersService.findBySlug(slug);
  if (!founder) throw new ApiError(404, `Founder not found: ${slug}`);
  const companies = await foundersService.getCompanies(founder.id);
  res.json(new ApiResponse(200, { founder, companies }));
});

module.exports = { getAllFounders, getFounderBySlug };
