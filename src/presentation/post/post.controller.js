class PostController {
  constructor(
    createPostUseCase,
    getPostByIdUseCase,
    getAllPostsUseCase,
    updatePostUseCase,
    deletePostUseCase
  ) {
    this.createPostUseCase = createPostUseCase;
    this.getPostByIdUseCase = getPostByIdUseCase;
    this.getAllPostsUseCase = getAllPostsUseCase;
    this.updatePostUseCase = updatePostUseCase;
    this.deletePostUseCase = deletePostUseCase;
  }

  createPost = async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      const authorId = req.user.id; // Assuming user ID is available from authentication middleware
      const post = await this.createPostUseCase.execute(title, content, tags, authorId);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getPosts = async (req, res) => {
    try {
      const posts = await this.getAllPostsUseCase.execute();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getPostById = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await this.getPostByIdUseCase.execute(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, tags } = req.body;
      const updatedPost = await this.updatePostUseCase.execute(id, title, content, tags);
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      await this.deletePostUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

module.exports = PostController;
