const passport = require("passport");
const validator = require("validator");
const Admin = require("../models/Admin");

exports.getAdminLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/admin/profile");
  }
  res.render("admin-login", {
    title: "Login",
  });
};

exports.postAdminLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/admin/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('ERROR: admin user not found')
      req.admin.flash("errors", info);
      return res.redirect("/admin/login");
    }
    req.admin.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.admin.flash("success", { msg: "Success! You are logged in." });
      console.log('admin login SUCCESS!')
      res.redirect(req.session.returnTo || "/admin/profile");
    });
  })(req, res, next);
};

exports.adminLogout = (req, res) => {
  req.logout(() => {
    console.log('Admin has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/admin");
  });
};

exports.getAdminSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/admin/profile");
  }
  res.render("admin-signup", {
    title: "Create Account",
  });
};

exports.postAdminSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new Admin({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  Admin.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/admin/profile");
        });
      });
    }
  );
};
