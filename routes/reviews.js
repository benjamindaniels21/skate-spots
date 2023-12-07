//  cSpell:ignore Skatespots, skatespot

const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Skatespot = require("../models/skatespot");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const { reviewSchema } = require("../Schemas"); //getting an error when this is capitalized

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const skatespot = await skatespot.findById(req.params.id);
    const review = new Review(req.body.review);
    skatespot.reviews.push(review);
    await review.save();
    await skatespot.save();
    req.flash("success", "Created new review!");
    res.redirect(`/skatespots/${skatespot._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { reviewId, id } = req.params;
    await Skatespot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/skatespots/${id}`);
  })
);

module.exports = router;
