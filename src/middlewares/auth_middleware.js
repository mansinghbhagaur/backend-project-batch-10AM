const User = require("../models/user_model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // check token
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // check if user is active
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access token");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid Access token");
  }
});

module.exports = {
  verifyJwt,
};
