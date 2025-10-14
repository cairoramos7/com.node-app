const request = require("supertest");
const mongoose = require("mongoose");
const UserModel = require("../../src/infrastructure/user/user.model");

let testUserForAuthMiddleware;

jest.doMock("@src/presentation/auth/auth.middleware", () =>
  jest.fn((req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token === "validToken" && testUserForAuthMiddleware) {
        req.user = {
          id: testUserForAuthMiddleware._id.toString(),
          email: testUserForAuthMiddleware.email,
        };
        next();
      } else {
        res.status(401).json({ msg: "Token is not valid" });
      }
    } else {
      res.status(401).json({ msg: "No token, authorization denied" });
    }
  })
);

const app = require("@src/app");

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await UserModel.deleteMany({});
    testUserForAuthMiddleware = await UserModel.create({
      name: "Auth Middleware User",
      email: "auth.middleware@example.com",
      password: "password123",
    });
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    // Re-create the user for the auth middleware mock in each test to ensure a clean state
    testUserForAuthMiddleware = await UserModel.create({
      name: "Auth Middleware User",
      email: "auth.middleware@example.com",
      password: "password123",
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("userId");
    const user = await UserModel.findOne({ email: "test@example.com" });
    expect(user).toBeDefined();
  });

  it("should not register a user with existing email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email: "duplicate@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another Duplicate User",
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
        name: "Login User",
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

  it("should return authenticated user data on /whoami", async () => {
    // Register a user
    const registeredUserRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Whoami User",
        email: "whoami@example.com",
        password: "password123",
      });

    // Update the mock middleware's user to the newly registered user
    testUserForAuthMiddleware = await UserModel.findById(registeredUserRes.body.userId);

    // Login to get a token (though not strictly needed for the mock, it's part of the flow)
    await request(app)
      .post("/api/auth/login")
      .send({
        email: "whoami@example.com",
        password: "password123",
      });
    const token = "validToken"; // Use the validToken for the mock

    // Make whoami request with the token
    const whoamiRes = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(whoamiRes.statusCode).toEqual(200);
    expect(whoamiRes.body).toHaveProperty("id", testUserForAuthMiddleware._id.toString());
    expect(whoamiRes.body).toHaveProperty("email", "whoami@example.com"); // Expect actual email
    expect(whoamiRes.body).not.toHaveProperty("password"); // Ensure password is not returned
  });

  it("should return 401 if no token is provided on /whoami", async () => {
    const res = await request(app)
      .get("/api/auth/whoami");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("msg", "No token, authorization denied");
  });

  it("should return 401 if an invalid token is provided on /whoami", async () => {
    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer invalidtoken`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("msg", "Token is not valid");
  });
});