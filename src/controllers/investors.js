const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const investorsService = require('../services/investors');

const getAllInvestors = asyncHandler(async (req, res) => {
  const { page, limit, search, type, sortBy, sortOrder } = req.query;

  const result = await investorsService.findAll({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    search,
    type,
    sortBy: sortBy || 'name',
    sortOrder: sortOrder || 'asc',
  });

  const response = new ApiResponse(200, {
    investors: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  });

  res.status(response.statusCode).json(response);
});

const getInvestorBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const investor = await investorsService.findBySlug(slug);
  if (!investor) {
    throw new ApiError(404, `Investor not found: ${slug}`);
  }

  const [portfolioCompanies, ledFundingRounds] = await Promise.all([
    investorsService.getPortfolioCompanies(investor.id),
    investorsService.getLedFundingRounds(investor.id),
  ]);

  const response = new ApiResponse(200, {
    investor,
    portfolioCompanies,
    ledFundingRounds,
  });

  res.status(response.statusCode).json(response);
});

module.exports = { getAllInvestors, getInvestorBySlug };
