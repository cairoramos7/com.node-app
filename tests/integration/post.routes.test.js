const request = require("supertest");
const mongoose = require("mongoose");
const app = require("@src/app");
const UserModel = require("@src/infrastructure/user/user.model");
const PostModel = require("@src/infrastructure/post/post.model");
const jwt = require("jsonwebtoken");

describe("Post Routes Integration Tests", () => {
  let token;
  let testUser;

  beforeAll(async () => {
    process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/ddd-blog-test";
    process.env.JWT_SECRET = "testsecret";
    if (mongoose.connection.readyState === 0) { // Check if not connected
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Register a test user and get a token
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "postuser@example.com",
        password: "password123",
      });
    testUser = await UserModel.findOne({ email: "postuser@example.com" });
    token = jwt.sign({ id: testUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  afterEach(async () => {
    await PostModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Post",
        content: "This is the content of my first post.",
        tags: ["nodejs", "ddd"],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title", "My First Post");
    expect(res.body).toHaveProperty("authorId", testUser._id.toString());
  });

  it("should get all posts", async () => {
    await PostModel.create({
      title: "Post 1",
      content: "Content 1",
      authorId: testUser._id,
    });
    await PostModel.create({
      title: "Post 2",
      content: "Content 2",
      authorId: testUser._id,
    });

    const res = await request(app).get("/api/posts");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("title", "Post 1");
  });

  it("should get a post by ID", async () => {
    const createdPost = await PostModel.create({
      title: "Specific Post",
      content: "Content for specific post",
      authorId: testUser._id,
    });

    const res = await request(app).get(`/api/posts/${createdPost._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Specific Post");
  });

  it("should return 404 if post not found by ID", async () => {
    const res = await request(app).get(`/api/posts/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Post not found");
  });

  it("should update a post", async () => {
    const createdPost = await PostModel.create({
      title: "Old Title",
      content: "Old Content",
      authorId: testUser._id,
    });

    const res = await request(app)
      .put(`/api/posts/${createdPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        content: "Updated Content",
        tags: ["updated"],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Updated Title");
    expect(res.body).toHaveProperty("tags", ["updated"]);
  });

  it("should delete a post", async () => {
    const createdPost = await PostModel.create({
      title: "To Be Deleted",
      content: "Delete me",
      authorId: testUser._id,
    });

    const res = await request(app)
      .delete(`/api/posts/${createdPost._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);

    const foundPost = await PostModel.findById(createdPost._id);
    expect(foundPost).toBeNull();
  });
});
