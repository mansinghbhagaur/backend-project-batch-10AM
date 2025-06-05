const express = require("express");

const router = express.Router();

const { register, loginUser } = require("../controllers/user_controller.js");

router.route("/register").post(register);
router.route("/login").post(loginUser);

module.exports = router;
