// server.js

const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB
const { swaggerSetup } = require('./swagger.js'); // Import Swagger setup
const apiRouter = require('./routes/exampleRoute.js'); // Import API routes
const dotenv = require('dotenv'); // Import dotenv for environment variables
const standardizedResponse = require('./middlewares/standardResponse.js'); // Import custom response middleware
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.BACKEND_PORT || 3000; // Define port

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(standardizedResponse); // Use custom response middleware

// Routes
app.use('/api', apiRouter); // Use API routes

app.get('/', (req, res) => {
  // Redirect to API documentation
  res.redirect('/api-docs');
});

// Swagger configuration
swaggerSetup(app);

// Connect to MongoDB
let mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice';
if (process.env.NODE_ENV === 'test') {
  const mongod = new MongoMemoryServer(); // Fake MongoDB for testing
  // 'await' no se puede usar en el nivel superior con require, así que usamos promesas
  mongod.start().then(() => {
    mongoURI = mongod.getUri();
    console.log(mongoURI);
    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
      });
  });
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
    });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API documentation is available at http://localhost:${port}/api-docs`
  );
});

module.exports = app; // Export the Express application
