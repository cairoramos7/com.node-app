const PostModel = require('./post.model');
const IPostRepository = require('../../domain/post/post.repository');
const Post = require('../../domain/post/post.entity');

class PostRepository extends IPostRepository {
  constructor() {
    super();
  }

  async save(postEntity) {
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
      newPost.authorId.toString()
    );
  }

  async findById(id) {
    const post = await PostModel.findById(id);
    return post
      ? new Post(post._id.toString(), post.title, post.content, post.tags, post.authorId.toString())
      : null;
  }

  async findAll() {
    const posts = await PostModel.find();
    return posts.map(
      (post) =>
        new Post(post._id.toString(), post.title, post.content, post.tags, post.authorId.toString())
    );
  }

  async update(postEntity) {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postEntity.id,
      {
        title: postEntity.title,
        content: postEntity.content,
        tags: postEntity.tags,
      },
      { new: true }
    );
    return updatedPost
      ? new Post(
          updatedPost._id.toString(),
          updatedPost.title,
          updatedPost.content,
          updatedPost.tags,
          updatedPost.authorId.toString()
        )
      : null;
  }

  async delete(id) {
    const result = await PostModel.findByIdAndDelete(id);
    return result !== null;
  }
}

module.exports = PostRepository;
