const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const adminHomeController = require("../controllers/admin-home");
const adminPostsController = require("../controllers/admin-posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", adminHomeController.getAdminIndex);
router.get("/profile", ensureAuth, adminPostsController.getAdminProfile);
router.get("/:id", ensureAuth, adminPostsController.getPost);
router.post("/createPost", upload.single("file"), adminPostsController.createPost);
router.delete("/deletePost/:id", adminPostsController.deletePost);

module.exports = router;