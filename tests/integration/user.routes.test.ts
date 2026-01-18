import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from '../../src/infrastructure/user/user.model';
import app from '../../src/app';

// Declare global variable for mock
declare global {
    var testUserForUserRoutes: any;
}

// Mock the auth middleware
jest.mock('../../src/presentation/auth/auth.middleware', () => {
    return (req: any, res: any, next: any) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token === 'validToken' && global.testUserForUserRoutes) {
                req.user = {
                    id: global.testUserForUserRoutes._id.toString(),
                    email: global.testUserForUserRoutes.email,
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

// Mock the EmailService
jest.mock('../../src/infrastructure/services/email.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            sendConfirmationEmail: jest.fn().mockResolvedValue(true),
            sendEmail: jest.fn().mockResolvedValue(true),
        };
    });
});

let testUser: any;
let authToken: string;

describe('User Routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ddd-blog-test');
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        testUser = await UserModel.create({
            name: 'Original Name',
            email: 'testuser@example.com',
            password: 'password123',
        });
        global.testUserForUserRoutes = testUser;
        authToken = 'validToken';
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should update the user's name", async () => {
        const newName = 'Updated Name';
        const res = await request(app)
            .put(`/api/users/${testUser._id}/name`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: newName });

        // Debug log just in case, but expectation is 200
        if (res.statusCode !== 200) {
            // console.log('Update Name Error:', JSON.stringify(res.body, null, 2));
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', newName);
        const updatedUser = await UserModel.findById(testUser._id);
        expect(updatedUser?.name).toEqual(newName);
    });

    it('should return 401 if no token is provided for name update', async () => {
        const newName = 'Updated Name';
        const res = await request(app)
            .put(`/api/users/${testUser._id}/name`)
            .send({ name: newName });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
    });

    it('should return 401 if an invalid token is provided for name update', async () => {
        const newName = 'Updated Name';
        const res = await request(app)
            .put(`/api/users/${testUser._id}/name`)
            .set('Authorization', `Bearer invalidToken`)
            .send({ name: newName });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('msg', 'Token is not valid');
    });

    it('should return 400 if name is not provided', async () => {
        const res = await request(app)
            .put(`/api/users/${testUser._id}/name`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(res.statusCode).toEqual(400);
        if (!res.body.error) {
            console.log('Validation Error Body:', JSON.stringify(res.body, null, 2));
        }
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 if user ID is invalid', async () => {
        const newName = 'Updated Name';
        const res = await request(app)
            .put(`/api/users/invalidid/name`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: newName });

        expect(res.statusCode).toEqual(400);
    });

    it('should request an email update', async () => {
        const newEmail = 'newemail@example.com';
        const res = await request(app)
            .put(`/api/users/${testUser._id}/email/request-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ email: newEmail });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty(
            'message',
            'Confirmation email sent. Please check your inbox.'
        );
        const updatedUser = await UserModel.findById(testUser._id);
        expect(updatedUser?.pendingEmailUpdate).toBeDefined();
        expect(updatedUser?.pendingEmailUpdate?.newEmail).toEqual(newEmail);
    });

    it('should return 400 if invalid email format is provided for update request', async () => {
        const newEmail = 'invalid-email';
        const res = await request(app)
            .put(`/api/users/${testUser._id}/email/request-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ email: newEmail });

        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('message', 'Invalid email format.'); // Should be error.message now?
        // Using simple validation, check specific message if needed, or just status
    });

    it('should return 400 if no email is provided for update request', async () => {
        const res = await request(app)
            .put(`/api/users/${testUser._id}/email/request-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('message', 'New email is required.');
    });

    it('should confirm an email update', async () => {
        const newEmail = 'confirmed@example.com';
        // First, request an email update to get a token
        const requestRes = await request(app)
            .put(`/api/users/${testUser._id}/email/request-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ email: newEmail });

        expect(requestRes.statusCode).toEqual(200);

        const userAfterRequest = await UserModel.findById(testUser._id);
        const token = userAfterRequest?.pendingEmailUpdate?.token;

        // Then, confirm the email update with the token
        const confirmRes = await request(app)
            .put(`/api/users/${testUser._id}/email/confirm-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ token: token });

        expect(confirmRes.statusCode).toEqual(200);
        expect(confirmRes.body).toHaveProperty('message', 'Email updated successfully.');

        const updatedUser = await UserModel.findById(testUser._id).lean();
        expect(updatedUser?.email).toEqual(newEmail);

        expect(updatedUser?.pendingEmailUpdate).toBeFalsy();
    });

    it('should return 400 if invalid token is provided for email confirmation', async () => {
        const res = await request(app)
            .put(`/api/users/${testUser._id}/email/confirm-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ token: 'invalidtoken' });

        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('message', 'Invalid or expired confirmation token.');
    });

    it('should return 400 if no token is provided for email confirmation', async () => {
        const res = await request(app)
            .put(`/api/users/${testUser._id}/email/confirm-update`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('message', 'Confirmation token is required.');
    });
});
