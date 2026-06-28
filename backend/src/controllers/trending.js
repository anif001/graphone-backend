const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const trendingService = require('../services/trending');

const getTrending = asyncHandler(async (req, res) => {
  const { limit, days } = req.query;
  const companies = await trendingService.getTrending({
    limit: Math.min(parseInt(limit, 10) || 10, 50),
    days: Math.min(parseInt(days, 10) || 30, 365),
  });
  res.json(new ApiResponse(200, { companies }));
});

module.exports = { getTrending };
