const { Router } = require('express');
const ApiResponse = require('../utils/ApiResponse');
const companiesRouter = require('./companies');
const investorsRouter = require('./investors');
const productsRouter = require('./products');
const foundersRouter = require('./founders');
const newsRouter = require('./news');
const searchRouter = require('./search');
const feedRouter = require('./feed');
const trendingRouter = require('./trending');
const statsRouter = require('./stats');

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

router.use('/companies', companiesRouter);
router.use('/investors', investorsRouter);
router.use('/products', productsRouter);
router.use('/founders', foundersRouter);
router.use('/news', newsRouter);
router.use('/search', searchRouter);
router.use('/feed', feedRouter);
router.use('/trending', trendingRouter);
router.use('/stats', statsRouter);

router.get('/health', (req, res) => {
  const response = new ApiResponse(200, {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
  res.status(response.statusCode).json(response);
});

module.exports = router;
