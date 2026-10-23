/**
 * @file swagger.ts
 * @description Swagger/OpenAPI configuration for API documentation.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Personal Manager API',
            version: '1.0.0',
            description:
                'A personal manager application API built with Node.js following Domain-Driven Design (DDD) principles.',
            contact: {
                name: 'API Support',
                email: 'support@personal-manager.com',
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
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Task ID' },
                        title: { type: 'string', description: 'Task title' },
                        description: { type: 'string', description: 'Task description' },
                        isCompleted: { type: 'boolean', description: 'Completion status' },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Task tags',
                        },
                        authorId: { type: 'string', description: 'Author user ID' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'NOT_FOUND' },
                                message: { type: 'string', example: 'Resource not found' },
                                statusCode: { type: 'integer', example: 404 },
                                timestamp: { type: 'string', format: 'date-time' },
                                fields: {
                                    type: 'object',
                                    description: 'Optional validation fields',
                                    additionalProperties: { type: 'string' },
                                },
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
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', example: 'Buy groceries' },
                        description: {
                            type: 'string',
                            example: 'Milk, Eggs, Bread',
                        },
                        isCompleted: { type: 'boolean', example: false },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['home', 'shopping'],
                        },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Tasks', description: 'Task management endpoints' },
            { name: 'Health', description: 'Health check endpoints' },
        ],
    },
    // Look for files in both src and dist to handle dev and prod
    apis: [
        './src/presentation/**/*.routes.ts',
        './src/presentation/**/*.controller.ts',
        './dist/presentation/**/*.routes.js',
        './dist/presentation/**/*.controller.js',
    ],
};

const specs = swaggerJsdoc(options);

/**
 * Configures Swagger UI middleware on the Express app.
 * @param {Application} app - Express application instance.
 */
const setupSwagger = (app: Application): void => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            explorer: true,
            customSiteTitle: 'Personal Manager API Documentation',
        })
    );

    // Serve OpenAPI spec as JSON
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

export { setupSwagger, specs };
