const mongoose = require("mongoose");
const PostRepository = require("@src/infrastructure/post/post.repository");
const PostModel = require("@src/infrastructure/post/post.model");
const Post = require("@src/domain/post/post.entity");
const UserModel = require("@src/infrastructure/user/user.model");

describe("PostRepository Integration Tests", () => {
  let postRepository;
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/ddd-blog-test");
    postRepository = new PostRepository();

    // Create a test user for posts
    testUser = await UserModel.create({ email: "author@example.com", password: "hashedpassword" });
  });

  afterEach(async () => {
    await PostModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("should save a new post", async () => {
    const postEntity = new Post("dummyId", "Test Title", "Test Content", ["tag1"], testUser._id.toString());
    const savedPost = await postRepository.save(postEntity);

    expect(savedPost).toBeInstanceOf(Post);
    expect(savedPost.title).toBe("Test Title");
    expect(savedPost.id).toBeDefined();

    const foundPost = await PostModel.findById(savedPost.id);
    expect(foundPost.title).toBe("Test Title");
    expect(foundPost.authorId.toString()).toBe(testUser._id.toString());
  });

  it("should find a post by id", async () => {
    const createdPost = await PostModel.create({
      title: "Find Me",
      content: "Content to find",
      tags: ["search"],
      authorId: testUser._id,
    });

    const foundPost = await postRepository.findById(createdPost._id.toString());

    expect(foundPost).toBeInstanceOf(Post);
    expect(foundPost.title).toBe("Find Me");
    expect(foundPost.id).toBe(createdPost._id.toString());
  });

  it("should return null if post not found by id", async () => {
    const foundPost = await postRepository.findById(new mongoose.Types.ObjectId().toString());
    expect(foundPost).toBeNull();
  });

  it("should find all posts", async () => {
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

    const posts = await postRepository.findAll();

    expect(posts).toHaveLength(2);
    expect(posts[0]).toBeInstanceOf(Post);
    expect(posts[1]).toBeInstanceOf(Post);
  });

  it("should update an existing post", async () => {
    const createdPost = await PostModel.create({
      title: "Original Title",
      content: "Original Content",
      tags: ["old"],
      authorId: testUser._id,
    });

    const updatedPostEntity = new Post(createdPost._id.toString(), "Updated Title", "Updated Content", ["new"], testUser._id.toString());
    const result = await postRepository.update(updatedPostEntity);

    expect(result).toBeInstanceOf(Post);
    expect(result.title).toBe("Updated Title");
    expect(result.content).toBe("Updated Content");
    expect(result.tags).toEqual(["new"]);

    const foundPost = await PostModel.findById(createdPost._id);
    expect(foundPost.title).toBe("Updated Title");
  });

  it("should delete a post", async () => {
    const createdPost = await PostModel.create({
      title: "To Be Deleted",
      content: "Delete me",
      authorId: testUser._id,
    });

    const isDeleted = await postRepository.delete(createdPost._id.toString());
    expect(isDeleted).toBe(true);

    const foundPost = await PostModel.findById(createdPost._id);
    expect(foundPost).toBeNull();
  });
});
