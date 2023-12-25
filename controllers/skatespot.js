//  cSpell:ignore cloudinary, skatespot, skatespots

const Skatespot = require("../models/skatespot");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const skatespots = await Skatespot.find({});
  res.render("skatespots/index", { skatespots });
};

module.exports.renderNewForm = (req, res) => {
  res.render("skatespots/new");
};

module.exports.createSkatespot = async (req, res, next) => {
  const skatespot = new Skatespot(req.body.campground);
  skatespot.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  skatespot.author = req.user._id;
  await skatespot.save();
  console.log(skatespot);
  req.flash("success", "Successfully made a new skatespot!");
  res.redirect(`/skatespots/${skatespot._id}`);
};

module.exports.showSkatespot = async (req, res) => {
  const skatespot = await Skatespot.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(skatespot);
  if (!skatespot) {
    req.flash("error", "Cannot find that skatespot!");
    return res.redirect("/skatespots");
  }
  res.render("skatespots/show", { skatespot });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const skatespot = await skatespots.findById(id);
  if (!skatespot) {
    req.flash("error", "Cannot find that skatespot!");
    return res.redirect("/skatespots");
  }
  res.render("skatespots/edit", { skatespot });
};

module.exports.updateSkatespot = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const skatespot = await Skatespot.findByIdAndUpdate(id, {
    ...req.body.skatespot,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  skatespot.images.push(...imgs);
  await skatespot.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await skatespot.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated skatespot!");
  res.redirect(`/skatespots/${skatespot._id}`);
};

module.exports.deleteSkatespot = async (req, res) => {
  const { id } = req.params;
  const skatespot = await Skatespot.findById(id);
  if (!skatespot.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to update!");
    return res.redirect(`/skatespots/${id}`);
  }
  await Skatespot.findByIdAndDelete(id);
  req.flash("error", "Successfully deleted skatespot");
  res.redirect("/skatespots");
};
