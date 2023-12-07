//  cSpell:ignore Skatespots, skatespot

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Skatespot = require("../models/skatespot");

mongoose.connect("mongodb://localhost:27017/skate-spots");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Skatespot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const spot = new Skatespot({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/2078238`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam tempore velit vel dignissimos reprehenderit quam, ipsum eligendi quos eum molestias, eius at, aliquid excepturi fugit animi nobis voluptatum laudantium fuga.`,
      price: price,
    });
    await spot.save();
  }
};

seedDB();
