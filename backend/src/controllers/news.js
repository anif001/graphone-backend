const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const newsService = require('../services/news');

const getAllNews = asyncHandler(async (req, res) => {
  const { page, limit, search, source, sort: sortBy = 'published_at', order: sortOrder = 'desc' } = req.query;
  const result = await newsService.findAll({
    page: parseInt(page, 10) || 1,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    search, source,
    sortBy,
    sortOrder,
  });
  res.json(new ApiResponse(200, {
    news: result.data, total: result.total, page: result.page, limit: result.limit,
  }));
});

const getNewsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const article = await newsService.findBySlug(slug);
  if (!article) throw new ApiError(404, `News article not found: ${slug}`);
  const companies = await newsService.getCompanies(article.id);
  res.json(new ApiResponse(200, { article, companies }));
});

module.exports = { getAllNews, getNewsBySlug };
