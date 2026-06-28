const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const companiesService = require('../services/companies');

const getAllCompanies = asyncHandler(async (req, res) => {
  const { page, limit, search, sort: sortBy = 'name', order: sortOrder = 'asc' } = req.query;

  const result = await companiesService.findAll({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    search,
    sortBy,
    sortOrder,
  });

  const response = new ApiResponse(200, {
    companies: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  });

  res.status(response.statusCode).json(response);
});

const getCompanyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const company = await companiesService.findBySlug(slug);
  if (!company) {
    throw new ApiError(404, `Company not found: ${slug}`);
  }

  const [founders, products, fundingRounds, investors, news, relatedCompanies] = await Promise.all([
    companiesService.getFounders(company.id),
    companiesService.getProducts(company.id),
    companiesService.getFundingRounds(company.id),
    companiesService.getInvestors(company.id),
    companiesService.getNews(company.id),
    companiesService.getRelatedCompanies(company.id),
  ]);

  const response = new ApiResponse(200, {
    company,
    founders,
    products,
    fundingRounds,
    investors,
    news,
    relatedCompanies,
  });

  res.status(response.statusCode).json(response);
});

module.exports = { getAllCompanies, getCompanyBySlug };
