const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin-auth");
const adminHomeController = require("../controllers/admin-home");
const adminPostsController = require("../controllers/admin-posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", adminHomeController.getAdminIndex);
// router.get("/feed", ensureAuth, adminPostsController.getFeed);
// router.get("/profile", ensureAuth, adminPostsController.getAdminProfile);
router.get("/profile", adminPostsController.getAdminProfile);
router.get("/login", adminAuthController.getAdminLogin);
router.post("/login", adminAuthController.postAdminLogin);
router.get("/logout", adminAuthController.adminLogout);
router.get("/signup", adminAuthController.getAdminSignup);
router.post("/signup", adminAuthController.postAdminSignup);

module.exports = router;