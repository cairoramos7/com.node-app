const Post = require("@src/domain/post/post.entity");

class PostService {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async createPost(title, content, tags, authorId) {
    const newPost = new Post(null, title, content, tags, authorId);
    return await this.postRepository.save(newPost);
  }

  async getPostById(id) {
    return await this.postRepository.findById(id);
  }

  async getAllPosts() {
    return await this.postRepository.findAll();
  }

  async updatePost(id, title, content, tags) {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error("Post not found");
    }
    existingPost.title = title || existingPost.title;
    existingPost.content = content || existingPost.content;
    existingPost.tags = tags || existingPost.tags;
    return await this.postRepository.update(existingPost);
  }

  async deletePost(id) {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error("Post not found");
    }
    return await this.postRepository.delete(id);
  }
}

module.exports = PostService;
