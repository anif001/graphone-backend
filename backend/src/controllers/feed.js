const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const feedService = require('../services/feed');

const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await feedService.getFeed({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 50),
  });
  res.json(new ApiResponse(200, result));
});

module.exports = { getFeed };
