const { Router } = require('express');
const ApiResponse = require('../utils/ApiResponse');

const router = Router();

router.get('/', (req, res) => {
  const response = new ApiResponse(200, {
    name: 'GraphOne API',
    version: '1.0.0',
    description: 'AI Ecosystem Platform Backend',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
  res.status(response.statusCode).json(response);
});

router.get('/health', (req, res) => {
  const response = new ApiResponse(200, {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
  res.status(response.statusCode).json(response);
});

module.exports = router;
