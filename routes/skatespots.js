//  cSpell:ignore Skatespots, skatespot

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { skatespotSchema } = require("../Schemas.js");
const ExpressError = require("../utils/ExpressError");
const Skatespot = require("../models/skatespot");

const validateSkatespot = (req, res, next) => {
  const { error } = skatespotSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateSkatespot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("error", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
