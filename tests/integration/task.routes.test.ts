import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from '../../src/infrastructure/user/user.model';
import TaskModel from '../../src/infrastructure/task/task.model';
import app from '../../src/app';

let testUser: any;

declare global {
    var testUserForTaskRoutes: any;
}

// Mock auth middleware to bypass real token validation logic but set user
jest.mock('../../src/presentation/auth/auth.middleware', () => {
    return (req: any, res: any, next: any) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token === 'validToken' && global.testUserForTaskRoutes) {
                req.user = {
                    id: global.testUserForTaskRoutes._id.toString(),
                    email: 'mock@example.com',
                };
                next();
            } else {
                res.status(401).json({
                    success: false,
                    error: { message: 'Token is not valid', statusCode: 401, code: 'UNAUTHORIZED' },
                });
            }
        } else {
            res.status(401).json({
                success: false,
                error: {
                    message: 'No token, authorization denied',
                    statusCode: 401,
                    code: 'UNAUTHORIZED',
                },
            });
        }
    };
});

describe('Task Routes Integration Tests', () => {
    let token: string;

    beforeAll(async () => {
        // Connect to test database
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/com-node-app-test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }
        await UserModel.deleteMany({});
        testUser = await UserModel.create({
            email: 'taskuser@example.com',
            password: 'password123',
        });
        global.testUserForTaskRoutes = testUser;
        token = 'validToken';
    });

    beforeEach(async () => {
        await TaskModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Task',
                    description: 'This is a test task description',
                    tags: ['test', 'integration'],
                });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('Test Task');
            expect(res.body.description).toBe('This is a test task description');
            expect(res.body).toHaveProperty('authorId', testUser._id.toString());
            expect(res.body.isCompleted).toBe(false); // Default value
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'Task without title',
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/tasks', () => {
        it('should return all tasks', async () => {
            await TaskModel.create({
                title: 'Task 1',
                description: 'Description 1',
                authorId: testUser._id,
                tags: ['tag1'],
            });

            const res = await request(app).get('/api/tasks');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Task 1');
        });
    });

    describe('GET /api/tasks/:id', () => {
        it('should return a task by id', async () => {
            const task = await TaskModel.create({
                title: 'Task by ID',
                description: 'Description',
                authorId: testUser._id,
            });

            const res = await request(app).get(`/api/tasks/${task._id}`);

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Task by ID');
        });

        it('should return 404 for non-existent task', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/tasks/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('should update a task', async () => {
            const task = await TaskModel.create({
                title: 'Original Title',
                description: 'Original Description',
                authorId: testUser._id,
            });

            const res = await request(app)
                .put(`/api/tasks/${task._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Title',
                    isCompleted: true,
                });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated Title');
            expect(res.body.isCompleted).toBe(true);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('should delete a task', async () => {
            const task = await TaskModel.create({
                title: 'To Delete',
                description: 'Delete me',
                authorId: testUser._id,
            });

            const res = await request(app)
                .delete(`/api/tasks/${task._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(204);

            const deletedTask = await TaskModel.findById(task._id);
            expect(deletedTask).toBeNull();
        });
    });
});
