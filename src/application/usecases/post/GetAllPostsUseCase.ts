import Post from '../../../domain/post/post.entity';
import IPostRepository from '../../../domain/post/post.repository';

export default class GetAllPostsUseCase {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async execute(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}
