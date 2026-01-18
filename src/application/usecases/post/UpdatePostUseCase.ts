import Post from '../../../domain/post/post.entity';
import IPostRepository from '../../../domain/post/post.repository';

export default class UpdatePostUseCase {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async execute(id: string, title?: string, content?: string, tags?: string[]): Promise<Post> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new Error('Post not found');
    }
    
    // Using domain methods if available would be better, but simpler property update here to match previous logic
    if (title) existingPost.title = title;
    if (content) existingPost.content = content;
    if (tags) existingPost.tags = tags;
    
    // Note: To be purely domain-driven, we should check availability of domain methods like existingPost.updateTitle(title)
    // But for migration, we stick to the flow. 
    // Wait, I updated Post entity to have methods like `updateTitle`. 
    // The legacy JS logic was `existingPost.title = title || existingPost.title`.
    // I should probably use the domain methods if I can, but property assignment is also valid if properties are public.
    // They are public in my TS definition.
    
    return await this.postRepository.update(existingPost);
  }
}
