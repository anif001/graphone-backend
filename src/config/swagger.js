const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'GraphOne API',
    version: '1.0.0',
    description: 'AI Ecosystem Directory API — explore companies, investors, founders, products, and more.',
    contact: { name: 'GraphOne' },
  },
  servers: [
    { url: '/api/v1', description: 'API v1' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          statusCode: { type: 'integer' },
          data: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/companies': {
      get: {
        tags: ['Companies'],
        summary: 'List all companies',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'sort', schema: { type: 'string', enum: ['name', 'founded_year', 'created_at'] } },
          { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { '200': { description: 'List of companies' } },
      },
    },
    '/companies/{slug}': {
      get: {
        tags: ['Companies'],
        summary: 'Get company by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Company details' }, '404': { description: 'Company not found' } },
      },
    },
    '/investors': {
      get: {
        tags: ['Investors'],
        summary: 'List all investors',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'type', schema: { type: 'string', enum: ['VC', 'Angel', 'Corporate', 'Accelerator', 'Other'] } },
        ],
        responses: { '200': { description: 'List of investors' } },
      },
    },
    '/investors/{slug}': {
      get: {
        tags: ['Investors'],
        summary: 'Get investor by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Investor details' }, '404': { description: 'Investor not found' } },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'List of products' } },
      },
    },
    '/products/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Product details' }, '404': { description: 'Product not found' } },
      },
    },
    '/founders': {
      get: {
        tags: ['Founders'],
        summary: 'List all founders',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'List of founders' } },
      },
    },
    '/founders/{slug}': {
      get: {
        tags: ['Founders'],
        summary: 'Get founder by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Founder details' }, '404': { description: 'Founder not found' } },
      },
    },
    '/news': {
      get: {
        tags: ['News'],
        summary: 'List news articles',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
          { in: 'query', name: 'source', schema: { type: 'string' } },
          { in: 'query', name: 'company_slug', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'List of news articles' } },
      },
    },
    '/news/{slug}': {
      get: {
        tags: ['News'],
        summary: 'Get news article by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'News article details' }, '404': { description: 'Article not found' } },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Unified search across all entities',
        parameters: [
          { in: 'query', name: 'q', required: true, schema: { type: 'string' }, description: 'Search query (min 2 chars)' },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 5 } },
        ],
        responses: { '200': { description: 'Grouped search results' } },
      },
    },
    '/feed': {
      get: {
        tags: ['Feed'],
        summary: 'Chronological activity feed',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Feed items' } },
      },
    },
    '/trending': {
      get: {
        tags: ['Trending'],
        summary: 'Trending companies',
        parameters: [
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'days', schema: { type: 'integer', default: 30 } },
        ],
        responses: { '200': { description: 'Trending companies sorted by score' } },
      },
    },
    '/stats': {
      get: {
        tags: ['Statistics'],
        summary: 'Ecosystem statistics',
        responses: { '200': { description: 'Aggregate platform statistics' } },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { '200': { description: 'Server health status' } },
      },
    },
  },
};

const swaggerSetup = (app) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = { swaggerSetup, swaggerDocument };
