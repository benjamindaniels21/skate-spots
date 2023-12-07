//  cSpell:ignore Skatespots, skatespot

const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
  console.log("server running");
});
