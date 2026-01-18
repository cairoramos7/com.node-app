const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/infrastructure/database/mongodb');

// Import Swagger configuration
const { setupSwagger } = require('./src/presentation/swagger');

// Import error handler
const errorHandler = require('./src/presentation/middlewares/errorHandler');

// Import DI container
const container = require('./src/shared/container');

// Import concrete implementations
const ConcreteUserRepository = require('./src/infrastructure/user/user.repository');
const ConcreteEmailService = require('./src/infrastructure/services/email.service');
const ConcretePostRepository = require('./src/infrastructure/post/post.repository');

// Import User Use Cases
const UpdateUserNameUseCase = require('./src/application/usecases/user/UpdateUserNameUseCase');
const RequestEmailUpdateUseCase = require('./src/application/usecases/user/RequestEmailUpdateUseCase');
const ConfirmEmailUpdateUseCase = require('./src/application/usecases/user/ConfirmEmailUpdateUseCase');
const UpdatePasswordUseCase = require('./src/application/usecases/user/UpdatePasswordUseCase');

// Import Auth Use Cases
const RegisterUserUseCase = require('./src/application/usecases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('./src/application/usecases/auth/LoginUserUseCase');
const WhoamiUseCase = require('./src/application/usecases/auth/WhoamiUseCase');

// Import Post Use Cases
const CreatePostUseCase = require('./src/application/usecases/post/CreatePostUseCase');
const GetPostByIdUseCase = require('./src/application/usecases/post/GetPostByIdUseCase');
const GetAllPostsUseCase = require('./src/application/usecases/post/GetAllPostsUseCase');
const UpdatePostUseCase = require('./src/application/usecases/post/UpdatePostUseCase');
const DeletePostUseCase = require('./src/application/usecases/post/DeletePostUseCase');

// Import Controllers
const UserController = require('./src/presentation/user/user.controller');
const AuthController = require('./src/presentation/auth/auth.controller');
const PostController = require('./src/presentation/post/post.controller');

// Import Routes
const authRoutes = require('./src/presentation/auth/auth.routes');
const postRoutes = require('./src/presentation/post/post.routes');
const userRoutes = require('./src/presentation/user/user.routes');

dotenv.config({ path: './.env.local' });

const app = express();

// Connect to Database
connectDB();

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
app.get('/api/health', (req, res) => {
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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
app.use('/api/auth', authRoutes(container.resolve('authController')));
app.use('/api/posts', postRoutes(container.resolve('postController')));
app.use('/api/users', userRoutes(container.resolve('userController')));

// 404 handler for undefined routes
app.use((req, res) => {
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
module.exports = app;
