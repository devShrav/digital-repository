const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Admin = require("../models/User")

module.exports = {
  getAdminProfile: async (req, res) => {
    try {
      // const posts = await Post.find({ user: req.user.id });
      const posts = await Post.find();
      console.log(posts)
      res.render("admin-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  /*
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  */
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const resourceType = req.file.mimetype.split('/')[0]
      console.log(resourceType)
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
      await Post.create({
        title: req.body.title,
        file: result.secure_url,
        cloudinaryId: result.public_id,
        author: req.body.author,
        year: req.body.year,
        language: req.body.language,
        description: req.body.description,
        type: resourceType,
        likes: 0,
      });
      console.log("Post has been added!");
      res.redirect("/admin/profile");
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
      res.redirect("/admin/profile");
    } catch (err) {
      res.redirect("/admin/profile");
    }
  },
};
