import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/database/mongodb';
import helmet from 'helmet';
import compression from 'compression';
import { globalLimiter } from './presentation/middlewares/rate-limit.middleware';
import morganMiddleware from './infrastructure/logger/morgan.middleware';

// Import Swagger configuration
import { setupSwagger } from './presentation/swagger';

// Import error handler
import errorHandler from './presentation/middlewares/error-handler';

// Import DI container
import container from './shared/container';

// Import concrete implementations
import ConcreteUserRepository from './infrastructure/user/user.repository';
import ConcreteEmailService from './infrastructure/services/email.service';
import ConcreteTaskRepository from './infrastructure/task/task.repository';

// Import User Use Cases
import UpdateUserNameUseCase from './application/usecases/user/update-user-name-use-case';
import RequestEmailUpdateUseCase from './application/usecases/user/request-email-update-use-case';
import ConfirmEmailUpdateUseCase from './application/usecases/user/confirm-email-update-use-case';
import UpdatePasswordUseCase from './application/usecases/user/update-password-use-case';

// Import Auth Use Cases
import RegisterUserUseCase from './application/usecases/auth/register-user-use-case';
import LoginUserUseCase from './application/usecases/auth/login-user-use-case';
import WhoamiUseCase from './application/usecases/auth/whoami-use-case';

// Import Task Use Cases
import CreateTaskUseCase from './application/usecases/task/create-task-use-case';
import GetTaskByIdUseCase from './application/usecases/task/get-task-by-id-use-case';
import GetAllTasksUseCase from './application/usecases/task/get-all-tasks-use-case';
import UpdateTaskUseCase from './application/usecases/task/update-task-use-case';
import DeleteTaskUseCase from './application/usecases/task/delete-task-use-case';

// Import Controllers
import UserController from './presentation/user/user.controller';
import AuthController from './presentation/auth/auth.controller';
import TaskController from './presentation/task/task.controller';

// Import Routes
import createAuthRoutes from './presentation/auth/auth.routes';
import createTaskRoutes from './presentation/task/task.routes';
import createUserRoutes from './presentation/user/user.routes';

dotenv.config({ path: './.env.local' });

const app: Express = express();

// Connect to Database
// connectDB(); // Moved to server.ts

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
app.use('/api', globalLimiter);

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
container.registerSingleton('taskRepository', () => new ConcreteTaskRepository());

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

// Register Task Use Cases
container.register('createTaskUseCase', (c) => new CreateTaskUseCase(c.resolve('taskRepository')));
container.register(
    'getTaskByIdUseCase',
    (c) => new GetTaskByIdUseCase(c.resolve('taskRepository'))
);
container.register(
    'getAllTasksUseCase',
    (c) => new GetAllTasksUseCase(c.resolve('taskRepository'))
);
container.register('updateTaskUseCase', (c) => new UpdateTaskUseCase(c.resolve('taskRepository')));
container.register('deleteTaskUseCase', (c) => new DeleteTaskUseCase(c.resolve('taskRepository')));

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
    'taskController',
    (c) =>
        new TaskController(
            c.resolve('createTaskUseCase'),
            c.resolve('getTaskByIdUseCase'),
            c.resolve('getAllTasksUseCase'),
            c.resolve('updateTaskUseCase'),
            c.resolve('deleteTaskUseCase')
        )
);

// Define Routes
app.use('/api/auth', createAuthRoutes(container.resolve('authController')));
app.use('/api/tasks', createTaskRoutes(container.resolve('taskController')));
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
