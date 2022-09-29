const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Admin = require("../models/Admin")

module.exports = {
  getAdminProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("admin-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const commentedBy = []
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({createdAt: "asc"}).lean();
      for(const comment of comments) {
        let useri = await Admin.find(comment.user).lean()
        commentedBy.push(useri[0].userName)
      }
      res.render("post.ejs", { post: post, user: req.user, comments: comments, commentedBy: commentedBy});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
