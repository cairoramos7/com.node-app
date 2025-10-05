const request = require("supertest");
const mongoose = require("mongoose");
const app = require("@src/app");
const UserModel = require("@src/infrastructure/user/user.model");

describe("Auth Routes Integration Tests", () => {
  beforeAll(async () => {
    process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/ddd-blog-test";
    process.env.JWT_SECRET = "testsecret";
    if (mongoose.connection.readyState === 0) { // Check if not connected
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "register@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("userId");

    const user = await UserModel.findOne({ email: "register@example.com" });
    expect(user).toBeDefined();
  });

  it("should not register a user with existing email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "duplicate@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "duplicate@example.com",
        password: "password456",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "User already exists");
  });

  it("should login a user and return a token", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "login@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });
});
