const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./src/infrastructure/database/mongodb");
const authRoutes = require("./src/presentation/auth/auth.routes");
const postRoutes = require("./src/presentation/post/post.routes");
const userRoutes = require("./src/presentation/user/user.routes");
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger');

dotenv.config({ path: './.env.local' });

const app = express();

// Connect Database
connectDB();

app.use(cors());

// Init Middleware
app.use(express.json());

// Serve static files from the 'public' directory
// app.use(express.static('public'));

// Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
