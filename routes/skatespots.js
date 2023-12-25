//  cSpell:ignore Skatespots, skatespot

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { skatespotSchema } = require("../Schemas.js");
const { isLoggedIn, validateSkatespot, isAuthor } = require("../middleware.js");
const ExpressError = require("../utils/ExpressError");
const Skatespot = require("../models/skatespot");
const skatespots = require("../controllers/skatespot.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get(
  "/",
  catchAsync(async (req, res) => {
    const skatespots = await Skatespot.find({});
    res.render("skatespots/index", { skatespots });
  })
);

router.get("/new", (req, res) => {
  res.render("skatespots/new");
});

router.post(
  "/",
  isLoggedIn,
  validateSkatespot,
  catchAsync(async (req, res, next) => {
    const skatespot = new Skatespot(req.body.skatespot);
    await skatespot.save();
    req.flash("success", "Successfully made a new skate spot!");
    res.redirect(`/skatespots/${skatespot._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const skatespot = await Skatespot.findById(req.params.id).populate(
      "reviews"
    );
    if (!skatespot) {
      req.flash("error", "Cannot find that skatespot!");
      return res.redirect("/skatespots");
    }
    res.render("skatespots/show", { skatespot });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const skatespot = await Skatespot.findById(req.params.id);
    if (!skatespot) {
      req.flash("error", "Cannot find that skatespot!");
      return res.redirect("/skatespots");
    }
    res.render("skatespots/edit", { skatespot });
  })
);

router.put(
  "/:id",
  validateSkatespot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const skatespot = await Skatespot.findByIdAndUpdate(id, {
      ...req.body.skatespot,
    });
    req.flash("success", "Successfully updated skatespot!");
    res.redirect(`/skatespots/${skatespot._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Skatespot.findByIdAndDelete(id);
    req.flash("error", "Successfully deleted skatespot");
    res.redirect("/skatespots");
  })
);

module.exports = router;
