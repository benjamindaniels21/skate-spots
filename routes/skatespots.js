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

router
  .route("/")
  .get(catchAsync(skatespots.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateSkatespot,
    catchAsync(skatespots.createSkatespot)
  );

router.get("/new", isLoggedIn, skatespots.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(skatespots.showSkatespot))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateSkatespot,
    catchAsync(skatespots.updateSkatespot)
  )
  .delete(isLoggedIn, catchAsync(skatespots.deleteSkatespot));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(skatespots.renderEditForm)
);

module.exports = router;
