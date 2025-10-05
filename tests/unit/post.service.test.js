const PostService = require("@src/application/post.service");
const Post = require("@src/domain/post/post.entity");

// Mock PostRepository
const mockPostRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("PostService", () => {
  let postService;

  beforeEach(() => {
    postService = new PostService(mockPostRepository);
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a new post successfully", async () => {
      const newPost = new Post("newPostId", "Test Title", "Test Content", ["tag1"], "author123");
      mockPostRepository.save.mockResolvedValue(newPost);

      const post = await postService.createPost("Test Title", "Test Content", ["tag1"], "author123");

      expect(mockPostRepository.save).toHaveBeenCalledWith(expect.any(Post));
      expect(post).toBeInstanceOf(Post);
      expect(post.title).toBe("Test Title");
    });
  });

  describe("getPostById", () => {
    it("should return a post if found", async () => {
      const existingPost = new Post("postId123", "Existing Title", "Existing Content", [], "author123");
      mockPostRepository.findById.mockResolvedValue(existingPost);

      const post = await postService.getPostById("postId123");

      expect(mockPostRepository.findById).toHaveBeenCalledWith("postId123");
      expect(post).toBeInstanceOf(Post);
      expect(post.id).toBe("postId123");
    });

    it("should return null if post not found", async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      const post = await postService.getPostById("nonExistentId");

      expect(mockPostRepository.findById).toHaveBeenCalledWith("nonExistentId");
      expect(post).toBeNull();
    });
  });

  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      const posts = [
        new Post("1", "Title 1", "Content 1", [], "author1"),
        new Post("2", "Title 2", "Content 2", [], "author2"),
      ];
      mockPostRepository.findAll.mockResolvedValue(posts);

      const result = await postService.getAllPosts();

      expect(mockPostRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      const existingPost = new Post("postId123", "Old Title", "Old Content", ["old"], "author123");
      const updatedPost = new Post("postId123", "New Title", "New Content", ["new"], "author123");
      mockPostRepository.findById.mockResolvedValue(existingPost);
      mockPostRepository.update.mockResolvedValue(updatedPost);

      const result = await postService.updatePost("postId123", "New Title", "New Content", ["new"]);

      expect(mockPostRepository.findById).toHaveBeenCalledWith("postId123");
      expect(mockPostRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        id: "postId123",
        title: "New Title",
        content: "New Content",
        tags: ["new"],
      }));
      expect(result.title).toBe("New Title");
    });

    it("should throw an error if post not found", async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      await expect(postService.updatePost("nonExistentId", "New Title", "New Content", [])).rejects.toThrow("Post not found");
      expect(mockPostRepository.findById).toHaveBeenCalledWith("nonExistentId");
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deletePost", () => {
    it("should delete an existing post", async () => {
      const existingPost = new Post("postId123", "Title", "Content", [], "author123");
      mockPostRepository.findById.mockResolvedValue(existingPost);
      mockPostRepository.delete.mockResolvedValue(true);

      const result = await postService.deletePost("postId123");

      expect(mockPostRepository.findById).toHaveBeenCalledWith("postId123");
      expect(mockPostRepository.delete).toHaveBeenCalledWith("postId123");
      expect(result).toBe(true);
    });

    it("should throw an error if post not found", async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      await expect(postService.deletePost("nonExistentId")).rejects.toThrow("Post not found");
      expect(mockPostRepository.findById).toHaveBeenCalledWith("nonExistentId");
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });
  });
});
