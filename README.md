# DDD Node Application

This is a blog application project developed with Node.js, following Domain-Driven Design (DDD) principles. The goal is to demonstrate a clean and organized architecture with a clear separation of concerns between the domain, application, infrastructure, and presentation layers.

## Features

*   **User Authentication**: Register, login, logout, and session management with JWT.
*   **User Management**: Create, read, update, and delete user profiles.
*   **Post Management**: Create, read, update, and delete blog posts.
*   **Comments**: Add and manage comments on posts (feature to be implemented).
*   **Data Validation**: Robust input data validation using Joi.
*   **Data Persistence**: MongoDB integration using Mongoose.
*   **Comprehensive Testing**: Unit and integration tests to ensure code quality.

## Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web framework for Node.js.
*   **MongoDB**: NoSQL database.
*   **Mongoose**: ODM (Object Data Modeling) for MongoDB and Node.js.
*   **TypeScript**: Programming language that adds static typing to JavaScript.
*   **Joi**: For data schema validation.
*   **JWT (JSON Web Tokens)**: For authentication and authorization.
*   **Bcrypt**: For password hashing.
*   **Jest**: JavaScript testing framework.
*   **Supertest**: For testing HTTP routes.
*   **Docker**: For application and database containerization.
*   **ESLint**: For code linting.
*   **Prettier**: For automatic code formatting.

## Architecture

The application follows Domain-Driven Design (DDD) principles, organized into the following layers:

*   **`src/domain/`**: Contains the core business logic, entities, aggregates, repositories, and domain services. It is the heart of the application and independent of any technology.
    *   `post/`: Post-related entities and repositories.
    *   `user/`: User-related entities and repositories.
    *   `services/`: Interfaces for domain services (e.g., `EmailService`).
*   **`src/application/`**: Orchestrates domain operations to execute use cases. It contains application services that coordinate interactions between the domain and infrastructure.
    *   `usecases/`: Use case implementations (e.g., `CreateUserUseCase`, `UpdateUserNameUseCase`).
*   **`src/infrastructure/`**: Handles technical details such as data persistence, communication with external services, and frameworks.
    *   `database/`: Database configuration and connection (MongoDB).
    *   `post/`: Post repository implementations (e.g., `MongoDBPostRepository`).
    *   `user/`: User repository implementations (e.g., `MongoDBUserRepository`).
    *   `services/`: External service implementations (e.g., `NodemailerEmailService`).
*   **`src/presentation/`**: Contains the user interface or APIs. It is responsible for translating user requests into commands for the application layer and presenting the results.
    *   `auth/`: Authentication routes and controllers.
    *   `post/`: Post routes and controllers.
    *   `user/`: User routes and controllers.
*   **`src/shared/`**: Contains elements shared between layers, such as dependency injection.
    *   `container.js`: Dependency injection container configuration.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (version 18 or higher)
*   npm or Yarn (preferably Yarn)
*   Docker and Docker Compose (to run MongoDB)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/ddd-blog-app.git
    cd ddd-blog-app
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

### Environment Variables

Create a `.env` file in the project root based on `.env.example` and fill in the necessary variables:

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/ddd-blog
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@ddd-blog.com
```

### Running with Docker Compose

To start MongoDB and the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.




## How to Run the Application

### Development Mode

To start the application in development mode (with `nodemon` for automatic reloading):

```bash
yarn dev
```

### Production Mode

To compile and start the application in production mode:

```bash
yarn build
yarn start
```

The application will be available at `http://localhost:3000` (or the port configured in your environment variables).

## Running Tests

To run unit and integration tests:

```bash
yarn test
```

**Note**: If you encounter shared state issues between tests, run them sequentially:

```bash
yarn test --runInBand
```

## Commit Message Guidelines

All commit messages must follow the Conventional Commits format.

### Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

*   **feat**: New feature
*   **fix**: Bug fix
*   **docs**: Documentation changes
*   **style**: Code style changes (formatting, etc.)
*   **refactor**: Code refactoring
*   **test**: Adding or modifying tests
*   **chore**: Maintenance tasks, dependency updates

### Description Rules

*   Use imperative mood ("fix bug" not "fixed bug" or "fixes bug")
*   First letter lowercase
*   No period at the end
*   Maximum 72 characters for the first line

### Body (Optional)

*   Use if more context is needed
*   Explain what and why, not how
*   Wrap at 72 characters
*   Use bullet points for multiple changes

### Good Commit Examples

```
fix: correct findOne method signature in resolver

- Remove managerId parameter from findOne function
- Align service call to use only id parameter
- Fix typos and formatting issues
```

```
feat: add user authentication middleware

- Implement JWT token validation
- Add role-based access control
- Create authentication service
```

### Important Notes

*   **No namespaces** (avoid patterns like `fix(docs):`)
*   Keep messages concise but descriptive
*   Focus on the change, not the process
*   Reference issues/tickets in footer if needed