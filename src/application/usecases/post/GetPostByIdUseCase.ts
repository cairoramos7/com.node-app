import Post from '../../../domain/post/post.entity';
import IPostRepository from '../../../domain/post/post.repository';

export default class GetPostByIdUseCase {
    private postRepository: IPostRepository;

    constructor(postRepository: IPostRepository) {
        this.postRepository = postRepository;
    }

    async execute(id: string): Promise<Post | null> {
        return await this.postRepository.findById(id);
    }
}
