const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError("User not found", 404);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //  adding user refresh token to the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // access token is valid for 15 minutes
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, err.message);
    console.error(err);
  }
};

const register = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (!username === "") {
    throw res.json(
      new ApiError(400, "Username is Required", {
        message: "Username is required",
      })
    );
  }
  if (!fullname === "") {
    throw new ApiError(400, "Full name is required");
  }
  if (!email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!password === "") {
    throw new ApiError(400, "Password is required");
  }

  // existing user check
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw res.json(
      new ApiError(409, null, { message: "Username or Email already exists" })
    );
  }

  const user = await User.create({
    username,
    fullname,
    email,
    password,
  });

  // remove password and refresh token from the response
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // If all validations pass
  return res
    .status(200)
    .json(new ApiResponse(200, createUser, "Registration successful"));
});

// login user code
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // generate refresh and access tokens
  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // send cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login user successfully"
      )
    );
});

// logout controller
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "No refresh token provided"));
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_KEY
    );

    // user get
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token generated successfully"
        )
      );
  } catch (err) {
    console.log(err, "error hi ayega na galat karoge to :)");
  }
});

module.exports = {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
