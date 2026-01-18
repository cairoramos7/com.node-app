import IPostRepository from '../../../domain/post/post.repository';

export default class DeletePostUseCase {
    private postRepository: IPostRepository;

    constructor(postRepository: IPostRepository) {
        this.postRepository = postRepository;
    }

    async execute(id: string): Promise<void> {
        const existingPost = await this.postRepository.findById(id);
        if (!existingPost) {
            throw new Error('Post not found');
        }
        await this.postRepository.delete(id);
    }
}
