const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const statsService = require('../services/stats');

const getStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getStats();
  res.json(new ApiResponse(200, stats));
});

module.exports = { getStats };
