const express = require('express');
const auth = require('@src/presentation/auth/auth.middleware');

const router = express.Router();

module.exports = (postController) => {
  router.post('/', auth, postController.createPost);
  router.get('/', postController.getPosts);
  router.get('/:id', postController.getPostById);
  router.put('/:id', auth, postController.updatePost);
  router.delete('/:id', auth, postController.deletePost);

  return router;
};
