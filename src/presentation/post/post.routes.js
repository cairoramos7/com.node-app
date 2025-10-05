const express = require("express");
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("@src/presentation/post/post.controller");
const auth = require("../auth/auth.middleware");

const router = express.Router();

router.post("/", auth, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
