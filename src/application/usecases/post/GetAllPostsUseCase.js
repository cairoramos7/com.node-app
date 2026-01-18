class GetAllPostsUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute() {
    return await this.postRepository.findAll();
  }
}

module.exports = GetAllPostsUseCase;
