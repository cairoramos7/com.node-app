import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from '../../src/infrastructure/user/user.model';
import app from '../../src/app';

let testUserForAuthMiddleware: any;

// Mock Middleware
// Note: In TS, jest.doMock might need handling if ES modules are used. 
// However, we are running in 'node' environment with ts-jest, so it compiles to CJS or uses generic transformation.
// The file is imported via require in previous JS, here we use import.
// For mock to work with import, we might need to hoist it or use jest.mock().
// But we need closure over testUserForAuthMiddleware which is tricky with jest.mock() as it is hoisted.
// We can use doMock if we use dynamic import, or move logic inside the mock factory if possible.
// Or we can mock the middleware path before importing app. but imports are hoisted.
// We can use `require` for app inside `beforeAll` if we use `doMock`.

// Let's rely on Jest hoisting. 
// But variable `testUserForAuthMiddleware` is local. Accessing it inside `jest.mock` factory is not allowed if factory is hoisted.
// We can assign it to `global` or `process.env` or use a dedicated mock store.
// Or we can mock the module to verify the token and return a hardcoded user, avoiding dependency on outside variable.
// In the JS test, it accessed `testUserForAuthMiddleware`. `jest.doMock` is NOT hoisted, so it worked IF app was required AFTER doMock.
// Here I imported `app` at top level. This BREAKS `doMock`.
// I must use dynamic import or require for `app` inside `beforeAll` OR use `jest.mock` with some other mechanism.

// Let's assume standard behavior:
// 1. Mock middleware to return a fixed user or decode token if valid.
// 2. Or use closure variable if I conditionally require app.

// Refactored approach: Mock middleware globally for the test file using `jest.mock`, but providing a way to configure the user.
// Using `global` object as a bridge.

declare global {
  var testUserForAuthMiddleware: any;
}

jest.mock('../../src/presentation/auth/auth.middleware', () => {
    return (req: any, res: any, next: any) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token === 'validToken' && global.testUserForAuthMiddleware) {
                req.user = {
                    id: global.testUserForAuthMiddleware._id.toString(),
                    email: global.testUserForAuthMiddleware.email,
                };
                next();
            } else {
                res.status(401).json({ msg: 'Token is not valid' });
            }
        } else {
            res.status(401).json({ msg: 'No token, authorization denied' });
        }
    };
});


describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ddd-blog-test');
    await UserModel.deleteMany({});
    testUserForAuthMiddleware = await UserModel.create({
      name: 'Auth Middleware User',
      email: 'auth.middleware@example.com',
      password: 'password123',
    });
    global.testUserForAuthMiddleware = testUserForAuthMiddleware;
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    // Re-create the user for the auth middleware mock in each test to ensure a clean state
    testUserForAuthMiddleware = await UserModel.create({
      name: 'Auth Middleware User',
      email: 'auth.middleware@example.com',
      password: 'password123',
    });
    global.testUserForAuthMiddleware = testUserForAuthMiddleware;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('userId');
    const user = await UserModel.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
  });

  it('should not register a user with existing email', async () => {
    const firstRes = await request(app).post('/api/auth/register').send({
      name: 'Duplicate User',
      email: 'duplicate@example.com',
      password: 'password123',
    });
    expect(firstRes.statusCode).toEqual(201); 

    const res = await request(app).post('/api/auth/register').send({
      name: 'Another Duplicate User',
      email: 'duplicate@example.com',
      password: 'password456',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toHaveProperty('message', 'User already exists');
  });

  it('should login a user and return a token', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toHaveProperty('message', 'Invalid credentials');
  });

  it('should return authenticated user data on /whoami', async () => {
    // The testUserForAuthMiddleware is already set up in beforeEach
    const token = 'validToken'; // Use the validToken for the mock

    // Make whoami request with the token
    const whoamiRes = await request(app)
      .get('/api/auth/whoami')
      .set('Authorization', `Bearer ${token}`);

    expect(whoamiRes.statusCode).toEqual(200);
    expect(whoamiRes.body).toHaveProperty('id', testUserForAuthMiddleware._id.toString());
    expect(whoamiRes.body).toHaveProperty('email', testUserForAuthMiddleware.email); 
    expect(whoamiRes.body).not.toHaveProperty('password'); 
  });

  it('should return 401 if no token is provided on /whoami', async () => {
    const res = await request(app).get('/api/auth/whoami');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied'); // Assuming app global handler or middleware message
    // Note: The mock middleware returns generic msgs. My real middleware returns AppError. 
    // If I mock it, I return what mock returns.
    // My mock implementation above returns { msg: ... }.
  });

  it('should return 401 if an invalid token is provided on /whoami', async () => {
    const res = await request(app)
      .get('/api/auth/whoami')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('msg', 'Token is not valid');
  });
});
