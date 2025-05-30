const express = require("express");

const router = express.Router();

const { register } = require("../controllers/user_controller.js");

router.route("/register").post(register);

module.exports = router;
