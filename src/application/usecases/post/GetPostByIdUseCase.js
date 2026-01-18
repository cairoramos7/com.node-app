class GetPostByIdUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id) {
    return await this.postRepository.findById(id);
  }
}

module.exports = GetPostByIdUseCase;
