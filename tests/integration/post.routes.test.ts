import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from '../../src/infrastructure/user/user.model';
import PostModel from '../../src/infrastructure/post/post.model';
import app from '../../src/app';

let testUser: any;

declare global {
  var testUserForPostRoutes: any;
}

jest.mock('../../src/presentation/auth/auth.middleware', () => {
    return (req: any, res: any, next: any) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token === 'validToken' && global.testUserForPostRoutes) {
                req.user = { id: global.testUserForPostRoutes._id.toString(), email: 'mock@example.com' };
                next();
            } else {
                res.status(401).json({ msg: 'Token is not valid' });
            }
        } else {
            res.status(401).json({ msg: 'No token, authorization denied' });
        }
    };
});

describe('Post Routes Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ddd-blog-test');
    await UserModel.deleteMany({});
    testUser = await UserModel.create({
      email: 'postuser@example.com',
      password: 'password123',
    });
    global.testUserForPostRoutes = testUser;
    token = 'validToken'; 
  });

  beforeEach(async () => {
    await PostModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post content.',
        tags: ['test', 'jest'],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Post');
    expect(res.body).toHaveProperty('authorId', testUser._id.toString());
  });

  it('should get all posts', async () => {
    await PostModel.create({
      title: 'Post 1',
      content: 'Content 1',
      authorId: testUser._id,
    });
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('title', 'Post 1');
  });

  it('should get a post by ID', async () => {
    const createdPost = await PostModel.create({
      title: 'Post to find',
      content: 'Content to find.',
      authorId: testUser._id,
    });

    const res = await request(app).get(`/api/posts/${createdPost._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Post to find');
  });

  it('should return 404 if post not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/posts/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should update a post', async () => {
    const createdPost = await PostModel.create({
      title: 'Post to update',
      content: 'Content to update.',
      authorId: testUser._id, 
    });

    const res = await request(app)
      .put(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title',
        content: 'Updated content.',
        tags: ['updated'],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
    expect(res.body).toHaveProperty('tags', ['updated']);
  });

  it('should delete a post', async () => {
    const createdPost = await PostModel.create({
      title: 'Post to delete',
      content: 'Content to delete.',
      authorId: testUser._id, 
    });

    const res = await request(app)
      .delete(`/api/posts/${createdPost._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);

    const foundPost = await PostModel.findById(createdPost._id);
    expect(foundPost).toBeNull();
  });
});
