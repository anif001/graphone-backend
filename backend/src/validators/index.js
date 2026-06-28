const { query, param } = require('express-validator');
const { INVESTOR_TYPES, PRODUCT_CATEGORIES } = require('../constants');

const pagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const slugParam = [
  param('slug').isString().trim().notEmpty().withMessage('Slug is required'),
];

const searchQuery = [
  query('q').isString().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
];

const companiesList = [
  ...pagination,
  query('search').optional().isString().trim(),
  query('sort').optional().isIn(['name', 'founded_year', 'created_at']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
];

const investorsList = [
  ...pagination,
  query('type').optional().isIn(INVESTOR_TYPES).withMessage(`Type must be one of: ${INVESTOR_TYPES.join(', ')}`),
];

const productsList = [
  ...pagination,
  query('category').optional().isIn(PRODUCT_CATEGORIES).withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`),
];

const foundersList = [
  ...pagination,
  query('search').optional().isString().trim(),
];

const newsList = [
  ...pagination,
  query('source').optional().isString().trim(),
  query('company_slug').optional().isString().trim(),
];

module.exports = {
  pagination, slugParam, searchQuery,
  companiesList, investorsList, productsList, foundersList, newsList,
};
