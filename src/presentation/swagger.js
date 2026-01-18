/**
 * @file swagger.js
 * @description Swagger/OpenAPI configuration for API documentation.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DDD Blog API',
      version: '1.0.0',
      description:
        'A blog application API built with Node.js following Domain-Driven Design (DDD) principles.',
      contact: {
        name: 'API Support',
        email: 'support@ddd-blog.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
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
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', format: 'email', description: 'User email' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Post ID' },
            title: { type: 'string', description: 'Post title' },
            content: { type: 'string', description: 'Post content' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Post tags',
            },
            authorId: { type: 'string', description: 'Author user ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: { type: 'string', example: 'My First Post' },
            content: { type: 'string', example: 'This is the content of my first post.' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['nodejs', 'ddd'],
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Posts', description: 'Blog post endpoints' },
      { name: 'Health', description: 'Health check endpoints' },
    ],
  },
  apis: ['./src/presentation/**/*.routes.js', './src/presentation/**/*.controller.js'],
};

const specs = swaggerJsdoc(options);

/**
 * Configures Swagger UI middleware on the Express app.
 * @param {import('express').Application} app - Express application instance.
 */
const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customSiteTitle: 'DDD Blog API Documentation',
    })
  );

  // Serve OpenAPI spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = { setupSwagger, specs };
