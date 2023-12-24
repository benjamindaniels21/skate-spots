const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const SkatespotSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

SkatespotSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Skatespot", SkatespotSchema);
