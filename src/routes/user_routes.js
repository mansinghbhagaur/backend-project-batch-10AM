const express = require("express");
const { verifyJwt } = require("../middlewares/auth_middleware.js");
const router = express.Router();

const {
  register,
  loginUser,
  logoutUser,
} = require("../controllers/user_controller.js");

router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);

module.exports = router;
