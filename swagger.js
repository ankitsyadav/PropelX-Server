const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PropelX-CLUB Server APIs',
    version: '1.0.0',
    description: 'This is the API documentation for PropelX-CLUB, a platform for managing student profiles, projects, and authentication services. Here, you can find detailed information about the available endpoints, their parameters, and responses.',
  },
  servers: [
    {
      url: 'https://propel-x-server.vercel.app/', // Local development server
      description: 'Production development server',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};


// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./routes/*.js'], // Point to your route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };