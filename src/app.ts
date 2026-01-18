import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/database/mongodb';

// Import Swagger configuration
import { setupSwagger } from './presentation/swagger';

// Import error handler
import errorHandler from './presentation/middlewares/errorHandler';

// Import DI container
import container from './shared/container';

// Import concrete implementations
import ConcreteUserRepository from './infrastructure/user/user.repository';
import ConcreteEmailService from './infrastructure/services/email.service';
import ConcretePostRepository from './infrastructure/post/post.repository';

// Import User Use Cases
import UpdateUserNameUseCase from './application/usecases/user/UpdateUserNameUseCase';
import RequestEmailUpdateUseCase from './application/usecases/user/RequestEmailUpdateUseCase';
import ConfirmEmailUpdateUseCase from './application/usecases/user/ConfirmEmailUpdateUseCase';
import UpdatePasswordUseCase from './application/usecases/user/UpdatePasswordUseCase';

// Import Auth Use Cases
import RegisterUserUseCase from './application/usecases/auth/RegisterUserUseCase';
import LoginUserUseCase from './application/usecases/auth/LoginUserUseCase';
import WhoamiUseCase from './application/usecases/auth/WhoamiUseCase';

// Import Post Use Cases
import CreatePostUseCase from './application/usecases/post/CreatePostUseCase';
import GetPostByIdUseCase from './application/usecases/post/GetPostByIdUseCase';
import GetAllPostsUseCase from './application/usecases/post/GetAllPostsUseCase';
import UpdatePostUseCase from './application/usecases/post/UpdatePostUseCase';
import DeletePostUseCase from './application/usecases/post/DeletePostUseCase';

// Import Controllers
import UserController from './presentation/user/user.controller';
import AuthController from './presentation/auth/auth.controller';
import PostController from './presentation/post/post.controller';

// Import Routes
import createAuthRoutes from './presentation/auth/auth.routes';
import createPostRoutes from './presentation/post/post.routes';
import createUserRoutes from './presentation/user/user.routes';

dotenv.config({ path: './.env.local' });

const app: Express = express();

// Connect to Database
// connectDB(); // Moved to server.ts


// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger Documentation
setupSwagger(app);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'OK' }
 *                 timestamp: { type: string, format: date-time }
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Register dependencies in container
container.registerSingleton('userRepository', () => new ConcreteUserRepository());
container.registerSingleton('emailService', () => {
  const emailConfig = {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  };
  return new ConcreteEmailService(emailConfig);
});
container.registerSingleton('postRepository', () => new ConcretePostRepository());

// Register User Use Cases
container.register(
  'updateUserNameUseCase',
  (c) => new UpdateUserNameUseCase(c.resolve('userRepository'))
);
container.register(
  'requestEmailUpdateUseCase',
  (c) => new RequestEmailUpdateUseCase(c.resolve('userRepository'), c.resolve('emailService'))
);
container.register(
  'confirmEmailUpdateUseCase',
  (c) => new ConfirmEmailUpdateUseCase(c.resolve('userRepository'))
);
container.register(
  'updatePasswordUseCase',
  (c) => new UpdatePasswordUseCase(c.resolve('userRepository'), c.resolve('emailService'))
);

// Register Auth Use Cases
container.register(
  'registerUserUseCase',
  (c) => new RegisterUserUseCase(c.resolve('userRepository'))
);
container.register('loginUserUseCase', (c) => new LoginUserUseCase(c.resolve('userRepository')));
container.register('whoamiUseCase', (c) => new WhoamiUseCase(c.resolve('userRepository')));

// Register Post Use Cases
container.register('createPostUseCase', (c) => new CreatePostUseCase(c.resolve('postRepository')));
container.register(
  'getPostByIdUseCase',
  (c) => new GetPostByIdUseCase(c.resolve('postRepository'))
);
container.register(
  'getAllPostsUseCase',
  (c) => new GetAllPostsUseCase(c.resolve('postRepository'))
);
container.register('updatePostUseCase', (c) => new UpdatePostUseCase(c.resolve('postRepository')));
container.register('deletePostUseCase', (c) => new DeletePostUseCase(c.resolve('postRepository')));

// Register controllers
container.register(
  'userController',
  (c) =>
    new UserController(
      c.resolve('updateUserNameUseCase'),
      c.resolve('requestEmailUpdateUseCase'),
      c.resolve('confirmEmailUpdateUseCase'),
      c.resolve('updatePasswordUseCase')
    )
);

container.register(
  'authController',
  (c) =>
    new AuthController(
      c.resolve('registerUserUseCase'),
      c.resolve('loginUserUseCase'),
      c.resolve('whoamiUseCase')
    )
);

container.register(
  'postController',
  (c) =>
    new PostController(
      c.resolve('createPostUseCase'),
      c.resolve('getPostByIdUseCase'),
      c.resolve('getAllPostsUseCase'),
      c.resolve('updatePostUseCase'),
      c.resolve('deletePostUseCase')
    )
);

// Define Routes
app.use('/api/auth', createAuthRoutes(container.resolve('authController')));
app.use('/api/posts', createPostRoutes(container.resolve('postController')));
app.use('/api/users', createUserRoutes(container.resolve('userController')));

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

console.log('App initialized and exported.');
export default app;
