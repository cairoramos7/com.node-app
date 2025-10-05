class Post {
  constructor(id, title, content, tags, authorId) {
    if (!title || !content || !authorId) {
      throw new Error('Post must have a title, content, and authorId');
    }
    this.id = id;
    this.title = title;
    this.content = content;
    this.tags = tags || [];
    this.authorId = authorId;
  }

  // Domain methods related to Post
}

module.exports = Post;
