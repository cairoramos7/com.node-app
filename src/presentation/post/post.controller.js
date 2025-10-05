const PostService = require("../../application/post.service");
const PostRepository = require("../../infrastructure/post/post.repository");

const postRepository = new PostRepository();
const postService = new PostService(postRepository);

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const authorId = req.user.id; // Assuming user ID is available from authentication middleware
    const post = await postService.createPost(title, content, tags, authorId);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updatedPost = await postService.updatePost(id, title, content, tags);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.deletePost(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
