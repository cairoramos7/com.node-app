import Post from '../../../domain/post/post.entity';
import IPostRepository from '../../../domain/post/post.repository';

export default class CreatePostUseCase {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async execute(title: string, content: string, tags: string[], authorId: string): Promise<Post> {
    const newPost = new Post(null, title, content, tags, authorId);
    return await this.postRepository.save(newPost);
  }
}
