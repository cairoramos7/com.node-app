const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./src/infrastructure/database/mongodb");

// Importar o container de DI
const container = require('./src/shared/container');

// Importar dependências
const IUserRepository = require('./src/domain/user/user.repository');
const ConcreteUserRepository = require('./src/infrastructure/user/user.repository');
const IEmailService = require('./src/domain/services/email.service');
const ConcreteEmailService = require('./src/infrastructure/services/email.service');
const IPostRepository = require('./src/domain/post/post.repository');
const ConcretePostRepository = require('./src/infrastructure/post/post.repository');

// Importar Use Cases de Usuário
const UpdateUserNameUseCase = require('./src/application/usecases/user/UpdateUserNameUseCase');
const RequestEmailUpdateUseCase = require('./src/application/usecases/user/RequestEmailUpdateUseCase');
const ConfirmEmailUpdateUseCase = require('./src/application/usecases/user/ConfirmEmailUpdateUseCase');

// Importar Use Cases de Autenticação
const RegisterUserUseCase = require('./src/application/usecases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('./src/application/usecases/auth/LoginUserUseCase');
const WhoamiUseCase = require('./src/application/usecases/auth/WhoamiUseCase');

// Importar Use Cases de Post
const CreatePostUseCase = require('./src/application/usecases/post/CreatePostUseCase');
const GetPostByIdUseCase = require('./src/application/usecases/post/GetPostByIdUseCase');
const GetAllPostsUseCase = require('./src/application/usecases/post/GetAllPostsUseCase');
const UpdatePostUseCase = require('./src/application/usecases/post/UpdatePostUseCase');
const DeletePostUseCase = require('./src/application/usecases/post/DeletePostUseCase');

// Importar Controladores
const UserController = require('./src/presentation/user/user.controller');
const AuthController = require('./src/presentation/auth/auth.controller');
const PostController = require('./src/presentation/post/post.controller');

// Importar Rotas
const authRoutes = require("./src/presentation/auth/auth.routes");
const postRoutes = require("./src/presentation/post/post.routes");
const userRoutes = require("./src/presentation/user/user.routes");


dotenv.config({ path: './.env.local' });

const app = express();

// Conectar ao Banco de Dados
connectDB();

app.use(cors());
app.use(express.json());

// Registrar dependências no container
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

// Registrar Use Cases de Usuário
container.register('updateUserNameUseCase', (c) => new UpdateUserNameUseCase(c.resolve('userRepository')));
container.register('requestEmailUpdateUseCase', (c) => new RequestEmailUpdateUseCase(c.resolve('userRepository'), c.resolve('emailService')));
container.register('confirmEmailUpdateUseCase', (c) => new ConfirmEmailUpdateUseCase(c.resolve('userRepository')));

// Registrar Use Cases de Autenticação
container.register('registerUserUseCase', (c) => new RegisterUserUseCase(c.resolve('userRepository')));
container.register('loginUserUseCase', (c) => new LoginUserUseCase(c.resolve('userRepository')));
container.register('whoamiUseCase', (c) => new WhoamiUseCase(c.resolve('userRepository')));

// Registrar Use Cases de Post
container.register('createPostUseCase', (c) => new CreatePostUseCase(c.resolve('postRepository')));
container.register('getPostByIdUseCase', (c) => new GetPostByIdUseCase(c.resolve('postRepository')));
container.register('getAllPostsUseCase', (c) => new GetAllPostsUseCase(c.resolve('postRepository')));
container.register('updatePostUseCase', (c) => new UpdatePostUseCase(c.resolve('postRepository')));
container.register('deletePostUseCase', (c) => new DeletePostUseCase(c.resolve('postRepository')));

// Registrar controladores
container.register('userController', (c) => new UserController(
  c.resolve('updateUserNameUseCase'),
  c.resolve('requestEmailUpdateUseCase'),
  c.resolve('confirmEmailUpdateUseCase')
));

container.register('authController', (c) => new AuthController(
  c.resolve('registerUserUseCase'),
  c.resolve('loginUserUseCase'),
  c.resolve('whoamiUseCase')
));

container.register('postController', (c) => new PostController(
  c.resolve('createPostUseCase'),
  c.resolve('getPostByIdUseCase'),
  c.resolve('getAllPostsUseCase'),
  c.resolve('updatePostUseCase'),
  c.resolve('deletePostUseCase')
));

// Definir Rotas
app.use("/api/auth", authRoutes(container.resolve('authController')));
app.use("/api/posts", postRoutes(container.resolve('postController')));
app.use("/api/users", userRoutes(container.resolve('userController')));

module.exports = app;
