'use strict';

const deploy = (expressMiddelWares) => {
  return new Promise((resolve, reject) => {
    try {
      const config = require('./config'); // Import configuration
      const express = require('express'); // Import Express framework
      const { swaggerSetup } = require('./utils/swagger.js'); // Import Swagger setup
      const apiRouter = require('./routes/exampleRoute.js'); // Import API routes
      const computationRouter = require('./routes/computationRoute.js'); // Import computation routes
      const dotenv = require('dotenv'); // Import dotenv for environment variables
      const standardizedResponse = require('./middlewares/standardResponse.js'); // Import custom response middleware
      const errorHandler = require('./middlewares/errorHandler.js'); // Import error handler middleware
      var bodyParser = require('body-parser');
      const cors = require('cors');
      const logger = require('governify-commons').getLogger().tag('server');

      dotenv.config(); // Load environment variables

      const app = express(); // Create an Express application
      const port = config.serverPort; // Define port

      app.use(cors());
      app.use(
        bodyParser.json({
          strict: false,
        })
      );

      // Middlewares
      app.use(express.json()); // Parse JSON bodies
      app.use(standardizedResponse); // Use custom response middleware
      if (Array.isArray(expressMiddelWares)) {
        for (const middleware of expressMiddelWares) {
          app.use(middleware);
        }
      }

      // Routes
      app.use('/api', apiRouter); // Use API routes
      app.use('/api', computationRouter); // Use computation routes

      app.get('/', (req, res) => {
        res.redirect('/api-docs'); // Redirect to API documentation
      });

      app.use(errorHandler);

      // Swagger configuration
      swaggerSetup(app);

      // Start server
      app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
        logger.info(`API documentation is available at http://localhost:${port}/api-docs`);
        resolve(app);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const undeploy = () => {
  process.exit();
};

module.exports = {
  deploy: deploy,
  undeploy: undeploy,
};
