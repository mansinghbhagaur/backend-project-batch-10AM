const express = require("express");
const user_routes = require("./routes/user_routes");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: `${process.env.HOST}:${process.env.PORT}`,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome node js");
});

app.use("/api/users", user_routes);

module.exports = {
  app,
};
