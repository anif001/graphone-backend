const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./src/config');
const rootRouter = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middleware');
const { generalLimiter } = require('./src/middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(generalLimiter);

app.use('/api/v1', rootRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`GraphOne API running on port ${config.port} [${config.nodeEnv}]`);
});

module.exports = app;
