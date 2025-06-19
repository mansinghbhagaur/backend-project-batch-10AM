const express = require("express");
const { verifyJwt } = require("../middlewares/auth_middleware.js");
const router = express.Router();

const {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user_controller.js");
const upload = require("../middlewares/multer_middlewar.js");

router.route("/register").post(upload.single("image"), register);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

module.exports = router;
