class UpdatePostUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id, title, content, tags) {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    existingPost.title = title || existingPost.title;
    existingPost.content = content || existingPost.content;
    existingPost.tags = tags || existingPost.tags;
    return await this.postRepository.update(existingPost);
  }
}

module.exports = UpdatePostUseCase;
