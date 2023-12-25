//  cSpell:ignore skatespot, skatespots

const Skatespot = require("../models/skatespot");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const skatespot = await Skatespot.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  skatespot.reviews.push(review);
  await review.save();
  await skatespot.save();
  req.flash("success", "Created new review!");
  res.redirect(`/skatespots/${skatespot._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId, id } = req.params;
  await Skatespot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/skatespots/${id}`);
};
