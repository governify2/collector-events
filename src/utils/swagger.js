// swagger.js

const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express

// Load the OpenAPI specification from YAML file
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/api/oas.yaml');
// Export the Swagger UI setup
const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Serve Swagger UI
};
module.exports = { swaggerSetup };
