import Post from './post.entity';

export default interface IPostRepository {
    findById(id: string): Promise<Post | null>;
    findAll(): Promise<Post[]>;
    save(post: Post): Promise<Post>;
    update(post: Post): Promise<Post>;
    delete(id: string): Promise<void>;
}
