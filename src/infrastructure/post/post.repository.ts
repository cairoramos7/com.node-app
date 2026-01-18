import PostModel from './post.model';
import IPostRepository from '../../domain/post/post.repository';
import Post from '../../domain/post/post.entity';

class PostRepository implements IPostRepository {
    async save(postEntity: Post): Promise<Post> {
        const newPost = new PostModel({
            title: postEntity.title,
            content: postEntity.content,
            tags: postEntity.tags,
            authorId: postEntity.authorId,
        });
        await newPost.save();
        return new Post(
            newPost._id.toString(),
            newPost.title,
            newPost.content,
            newPost.tags,
            newPost.authorId.toString(),
            newPost.createdAt
        );
    }

    async findById(id: string): Promise<Post | null> {
        const post = await PostModel.findById(id);
        return post
            ? new Post(
                  post._id.toString(),
                  post.title,
                  post.content,
                  post.tags,
                  post.authorId.toString(),
                  post.createdAt
              )
            : null;
    }

    async findAll(): Promise<Post[]> {
        const posts = await PostModel.find();
        return posts.map(
            (post) =>
                new Post(
                    post._id.toString(),
                    post.title,
                    post.content,
                    post.tags,
                    post.authorId.toString(),
                    post.createdAt
                )
        );
    }

    async update(postEntity: Post): Promise<Post> {
        if (!postEntity.id) {
            throw new Error('Post ID is required for update');
        }
        const updatedPost = await PostModel.findByIdAndUpdate(
            postEntity.id,
            {
                title: postEntity.title,
                content: postEntity.content,
                tags: postEntity.tags,
            },
            { new: true }
        );

        if (!updatedPost) {
            throw new Error('Post not found');
        }

        return new Post(
            updatedPost._id.toString(),
            updatedPost.title,
            updatedPost.content,
            updatedPost.tags,
            updatedPost.authorId.toString(),
            updatedPost.createdAt
        );
    }

    async delete(id: string): Promise<void> {
        await PostModel.findByIdAndDelete(id);
    }
}

export default PostRepository;
