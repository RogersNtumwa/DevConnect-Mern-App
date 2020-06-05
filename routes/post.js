const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const {
  addPost,
  getPosts,
  singlePost,
  deletePost,
  likePost,
  unlikePost,
  addcomment,
  deleteComment,
} = require("../controllers/postController");

// @desc create new post
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  addPost
);

// @desc get all post
router.get("/", auth, getPosts);

// @desc get a specific post
router.get("/:post_id", auth, singlePost);

// @desc delete a specific post
router.delete("/:post_id", auth, deletePost);

// Like a post
router.put("/like/:post_id", auth, likePost);

// unLike a post
router.put("/unlike/:post_id", auth, unlikePost);

// add comment to a post
router.post(
  "/comments/:post_id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  addcomment
);

// add comment to a comment
router.delete("/comments/:post_id/:com_id", auth, deleteComment);

module.exports = router;
