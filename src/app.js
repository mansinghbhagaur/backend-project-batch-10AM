const express = require("express");
const user_routes = require("./routes/user_routes");
const app = express();

app.get("/", (req, res) => {
  res.send("welcome node js");
});

app.use("/api/users", user_routes);

module.exports = {
  app,
};
