const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const register = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (!username || username.trim === "") {
    throw res.status(400).json(
      new ApiError(400, "Username is Required", {
        message: "Username is required",
      })
    );
  }
  if (!fullname || fullname.trim === "") {
    throw new ApiError(400, "Full name is required");
  }
  if (!email || email.trim === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim === "") {
    throw new ApiError(400, "Password is required");
  }

  // If all validations pass
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Registration successful"));
});

module.exports = {
  register,
};
