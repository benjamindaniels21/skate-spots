//  cSpell:ignore Skatespots, skatespot
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const skatespots = require("./routes/skatespots");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://localhost:27017/skate-spots");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
  console.log("server running");
});
