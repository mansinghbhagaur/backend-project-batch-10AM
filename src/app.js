const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("welcome node js");
});

module.exports = {
  app,
};
