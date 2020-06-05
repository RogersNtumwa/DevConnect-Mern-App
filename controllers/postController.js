const Post = require("../models/Post");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @route POST api/v1/Post
// @desc  add a post
// @access Private
exports.addPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post({
      text: req.body.text,
      name: user.firstname,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();
    res.status(201).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/Posts
// @desc  get all posts
// @access Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ data: -1 });
    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/Posts/Post_id
// @desc  get a specific posts
// @access Private
exports.singlePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post)
      return res.status(404).json({ status: "fail", msg: "Post Not Found" });

    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json({ status: "fail", msg: "Post Not Found" });
    res.status(500).send("Server error");
  }
};

// @route DELETE api/v1/Posts/Post_id
// @desc  delete a specific posts
// @access Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post)
      return res.status(404).json({ status: "fail", msg: "Post Not Found" });

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        status: "fail",
        massege: "You have no permissions to delete this post",
      });
    }
    // remove post
    await post.remove();
    res.status(200).json({
      status: "fail",
      msg: "Post Removed",
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json({ status: "fail", msg: "Post Not Found" });
    res.status(500).send("Server error");
  }
};

// @route PUT api/v1/Posts/like/:Post_id
// @desc  like a specific posts
// @access Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Chck if user has already liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.status(201).json({
      status: "Success",
      data: post.likes,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route PUT api/v1/Posts/unlike/:Post_id
// @desc  unlike a posts
// @access Private
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Chck if user has already liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index
    const removeIndex = post.likes.map((like) =>
      like.user.toString().indexOf(req.user.id)
    );
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.status(201).json({
      status: "Success",
      data: post.likes,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route POST api/v1/Post/comment/post_id
// @desc  add a comment to a post
// @access Private
exports.addcomment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.post_id);

    const newComment = {
      text: req.body.text,
      name: user.firstname,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();
    res.status(201).json({
      status: "success",
      data: post.comments,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route DELETE api/v1/Post/comment/post_id/comment_id
// @desc  add a comment to a post
// @access Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // Pull out Comment
    const PostComment = post.comments.find(
      (comment) => comment.id === req.params.com_id
    );
    if (!PostComment)
      return res.status(404).json({ status: "fail", msg: "Comment Not Found" });

    // Check if user owns the comment
    if (PostComment.user.toString() !== req.user.id)
      return res.status(401).json({
        status: "fail",
        msg: "You have no permission to delete this comment",
      });

    // Get remove index
    const removeIndex = post.comments.map((comment) =>
      comment.user.toString().indexOf(req.user.id)
    );
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.status(200).json({
      status: "Success",
      data: post.comments,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json({ status: "fail", msg: "Comment Not Found" });
    res.status(500).send("Server error");
  }
};
