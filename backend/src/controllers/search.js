const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const searchService = require('../services/search');

const searchAll = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;
  const results = await searchService.search({ q, limit: Math.min(parseInt(limit, 10) || 5, 20) });
  res.json(new ApiResponse(200, results));
});

module.exports = { searchAll };
