const Post = require("@src/domain/post/post.entity");

class CreatePostUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(title, content, tags, authorId) {
    const newPost = new Post(null, title, content, tags, authorId);
    return await this.postRepository.save(newPost);
  }
}

module.exports = CreatePostUseCase;