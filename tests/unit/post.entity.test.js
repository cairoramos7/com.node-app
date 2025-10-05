const Post = require("@src/domain/post/post.entity");

describe("Post Entity", () => {
  it("should create a new post with valid properties", () => {
    const post = new Post("123", "Test Title", "Test Content", ["tag1"], "author1");
    expect(post.id).toBe("123");
    expect(post.title).toBe("Test Title");
    expect(post.content).toBe("Test Content");
    expect(post.tags).toEqual(["tag1"]);
    expect(post.authorId).toBe("author1");
  });

  it("should create a new post with optional id", () => {
    const post = new Post(null, "Test Title", "Test Content", ["tag1"], "author1");
    expect(post.id).toBeNull();
    expect(post.title).toBe("Test Title");
  });

  it("should throw an error if title is missing", () => {
    expect(() => new Post("1", null, "Test Content", [], "author1")).toThrow("Post must have a title, content, and authorId");
  });

  it("should throw an error if content is missing", () => {
    expect(() => new Post("1", "Test Title", null, [], "author1")).toThrow("Post must have a title, content, and authorId");
  });

  it("should throw an error if authorId is missing", () => {
    expect(() => new Post("1", "Test Title", "Test Content", [], null)).toThrow("Post must have a title, content, and authorId");
  });
});

  it("should initialize tags as an empty array if not provided", () => {
    const post = new Post("1", "Test Title", "Test Content", null, "author1");
    expect(post.tags).toEqual([]);
  });
