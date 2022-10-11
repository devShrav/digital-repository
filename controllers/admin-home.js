module.exports = {
  getAdminIndex: (req, res) => {
    res.redirect("/admin/login");
    // res.render("admin-index.ejs");
  },
};