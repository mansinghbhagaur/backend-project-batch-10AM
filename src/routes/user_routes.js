const express = require("express");

const router = express.Router();

const { register } = require("../controllers/user_controller");

router.route("/register").post(register);
