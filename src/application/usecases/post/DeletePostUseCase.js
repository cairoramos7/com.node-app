class DeletePostUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id) {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    return await this.postRepository.delete(id);
  }
}

module.exports = DeletePostUseCase;
