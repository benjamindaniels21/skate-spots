//  cSpell:ignore Skatespots, skatespot

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/skatespots");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  console.log("yo");
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    res.redirect("/skatespots/new");
  }
);

module.exports = router;
