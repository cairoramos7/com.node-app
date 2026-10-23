# com-node-app

[![CI](https://github.com/cairoramos7/com.node-app/actions/workflows/ci.yml/badge.svg)](https://github.com/cairoramos7/com.node-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A Node.js boilerplate built following **Domain-Driven Design (DDD)** principles. This project demonstrates clean architecture with a clear separation of concerns between domain, application, infrastructure, and presentation layers.

## Features

- **User Authentication**: Register, login, logout, and session management with JWT
- **User Management**: Create, read, update, and delete user profiles
- **Task Management**: Full CRUD operations for tasks with tagging and completion status
- **API Documentation**: Interactive Swagger UI at `/api-docs`
- **Data Validation**: Robust input validation using Joi
- **Data Persistence**: MongoDB integration using Mongoose
- **Comprehensive Testing**: Unit and integration tests with Jest
- **CI/CD**: Automated testing and linting with GitHub Actions
- **Docker Support**: Multi-stage Docker builds for production deployment

## Technologies Used

| Category             | Technologies                  |
| -------------------- | ----------------------------- |
| **Runtime**          | Node.js 18+                   |
| **Framework**        | Express.js 5                  |
| **Database**         | MongoDB with Mongoose         |
| **Authentication**   | JWT (JSON Web Tokens), Bcrypt |
| **Validation**       | Joi                           |
| **Documentation**    | Swagger/OpenAPI               |
| **Testing**          | Jest, Supertest               |
| **Code Quality**     | ESLint, Prettier              |
| **Package Manager**  | pnpm                          |
| **Containerization** | Docker, Docker Compose        |

## Architecture

The application follows Domain-Driven Design (DDD) principles. See [Architecture Documentation](docs/ARCHITECTURE.md) for details.

```
src/
├── domain/           # Core business logic (entities, repositories interfaces)
│   ├── task/         # Task entity and repository interface
│   ├── user/         # User entity and repository interface
│   └── services/     # Domain service interfaces
├── application/      # Use cases (orchestrates domain operations)
│   └── usecases/     # create-task-use-case, update-user-name-use-case, etc.
├── infrastructure/   # Technical implementations
│   ├── database/     # MongoDB connection
│   ├── task/         # Task repository implementation
│   ├── user/         # User repository implementation
│   ├── logger/       # Winston logger
│   └── services/     # Email service implementation
├── presentation/     # HTTP layer (routes, controllers)
│   ├── auth/         # Authentication endpoints
│   ├── task/         # Task endpoints
│   ├── user/         # User endpoints
│   └── middlewares/  # Error handling, validation, rate limiting
└── shared/           # Shared utilities
    └── errors/       # Custom error classes
```

## Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** (recommended) or npm
- **Docker** and Docker Compose (for MongoDB)

### Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:cairoramos7/com.node-app.git
    cd com.node-app
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/com-node-app
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@com-node-app.com
LOG_LEVEL=debug
```

## Running the Application

### Development Mode

Start MongoDB and run the application with hot-reload:

```bash
# Start MongoDB
docker-compose up mongodb -d

# Start the application in development mode
pnpm dev
```

### Production Mode

Build and run with Docker Compose:

```bash
docker-compose up --build
```

The application will be available at:

- **API**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/api/health`

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Main Endpoints

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/auth/register`  | Register a new user     |
| POST   | `/api/auth/login`     | Login and get JWT token |
| GET    | `/api/auth/whoami`    | Get current user info   |
| GET    | `/api/tasks`          | List all tasks          |
| POST   | `/api/tasks`          | Create a new task       |
| GET    | `/api/tasks/:id`      | Get task by ID          |
| PUT    | `/api/tasks/:id`      | Update a task           |
| DELETE | `/api/tasks/:id`      | Delete a task           |
| PUT    | `/api/users/name`     | Update user name        |
| PUT    | `/api/users/password` | Update password         |

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode (development)
pnpm test -- --watch
```

## Code Quality

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues automatically
pnpm lint:fix

# Check Prettier formatting
pnpm format:check

# Format code with Prettier
pnpm format
```

## Commit Message Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                     |
| ---------- | ------------------------------- |
| `feat`     | New feature                     |
| `fix`      | Bug fix                         |
| `docs`     | Documentation changes           |
| `style`    | Code style changes (formatting) |
| `refactor` | Code refactoring                |
| `test`     | Adding or modifying tests       |
| `chore`    | Maintenance tasks               |

### Examples

```bash
feat: add user authentication middleware
fix: correct password validation in login
docs: update API documentation
chore: upgrade dependencies
```

## Contributing

1. **Language**: All code, comments, commit messages, and issues must be in **English**.
2. **Architecture**: Strictly follow the Domain-Driven Design (DDD) layers.
3. **Testing**: Ensure new features are covered by tests.

## Project Structure

```
.
├── .github/workflows/   # CI/CD configuration
├── src/                 # Source code (DDD layers, TypeScript)
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── tests/               # Test files
│   ├── integration/     # Integration tests
│   └── unit/            # Unit tests
├── docker-compose.yml   # Docker services configuration
├── Dockerfile           # Production Docker image
└── package.json         # Project dependencies
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
