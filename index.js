// index.js
const express = require('express');
const cors = require('cors');
const { PORT, API_PREFIX, ALLOWED_ORIGINS } = require('./core/settings');
const { connectDB, disconnectDB } = require('./core/database');
const { initializeDependencies } = require('./core/deps');
const { appExceptionHandler, validationExceptionHandler, genericExceptionHandler } = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const logger = require('./core/logger').getLogger(__filename);
const setupLogging = require('./core/logger').setupLogging;

// Routes
// const authRouter = require('./routes/authRoutes');
// const candidateRouter = require('./routes/candidateRoutes');
// const companyRouter = require('./routes/companyRoutes');
// const interviewRouter = require('./routes/interviewRoutes');
// const dashboardRouter = require('./routes/dashboardRoutes');

(async function main() {
  const app = express();
  setupLogging();
  logger.info('Starting Backend (Express)');

  try {
    // Connect DB & init dependencies
    await initializeDependencies();
    logger.info('Dependencies initialized successfully');

    // Middleware
    app.use(express.json());
    app.use(requestId);
    app.use(cors({
      origin: ALLOWED_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Routes
    // app.use(`${API_PREFIX}/auth`, authRouter);
    // app.use(`${API_PREFIX}/candidate`, candidateRouter);
    // app.use(`${API_PREFIX}/company`, companyRouter);
    // app.use(`${API_PREFIX}/interview`, interviewRouter);
    // app.use(`${API_PREFIX}/analytical-dashboard`, dashboardRouter);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy' });
    });

    // Error handling (order matters)
    app.use(appExceptionHandler);
    app.use(validationExceptionHandler);
    app.use(genericExceptionHandler);

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server listening on http://localhost:${PORT}`);
    });

    // Shutdown hooks
    process.on('SIGINT', () => {
      disconnectDB();
      logger.info('Application shutdown complete');
      process.exit(0);
    });

  } catch (err) {
    logger.error(`Failed to start application: ${err.message}`, { err });
    process.exit(1);
  }
})();
