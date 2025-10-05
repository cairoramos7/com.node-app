# DDD Node Application

This is a Node application built with a Domain-Driven Design (DDD) architecture, focused on a clean and modular structure to facilitate maintenance and scalability.

## Features

*   **User Authentication**: User registration and login.
*   **Post Management**: Creation, reading, updating, and deletion of posts.
*   **Comments**: (If applicable, add this functionality)
*   **User Management**: (If applicable, add this functionality)

## Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web framework for Node.js.
*   **Jest**: Testing framework for JavaScript.
*   **Docker**: For containerization of the application and database.
*   **MongoDB**: NoSQL database (assumed from `docker-compose.yml` and infrastructure structure).

## Architecture

 The application follows Domain-Driven Design (DDD) principles, organized into the following layers:

*   **`src/domain/`**: Contains the core business logic, entities, aggregates, repositories, and domain services. It is the heart of the application and independent of any technology.
    *   `post/`: Post-related entities and repositories.
    *   `user/`: User-related entities and repositories.
*   **`src/application/`**: Orchestrates domain operations to perform use cases. Contains application services that coordinate interactions between the domain and infrastructure.
    *   `auth.service.js`: Authentication logic.
    *   `post.service.js`: Logic for post management.
*   **`src/infrastructure/`**: Deals with technical details such as data persistence, communication with external services, and frameworks.
    *   `database/`: Database configuration and connection.
    *   `post/`: Post repository implementations (e.g., MongoDB PostRepository).
    *   `user/`: User repository implementations (e.g., MongoDB UserRepository).
*   **`src/presentation/`**: Contains the user interface or APIs. It is responsible for translating user requests into commands for the application layer and presenting the results.
    *   `auth/`: Authentication routes and controllers.
    *   `post/`: Post routes and controllers.

## Getting Started

### Prerequisites

Make sure you have Node.js, npm (or yarn), and Docker installed on your machine.

*   [Node.js](https://nodejs.org/)
*   [Docker](https://www.docker.com/get-started)

### Installation

1.  Clone the repository:
    ```bash
    git clone <REPOSITORY_URL>
    cd ddd-blog-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env.local` file in the project root, based on `.env` (if it exists) or with the following variables:

```
# Example environment variables
PORT=3000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=your_jwt_secret_key
```

### Docker Configuration

To start the database (MongoDB) via Docker:

```bash
docker-compose up -d
```

To stop the database:

```bash
docker-compose stop
```

To restart the database:

```bash
docker-compose restart
```

To stop and remove containers, networks, and volumes:

```bash
docker-compose down
```




## Running the Application

To start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000` (or the port configured in your environment variables).

## Running Tests

To run unit and integration tests:

```bash
npm test
# or
yarn test
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