const { asyncHandler } = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  console.log(username, fullname, email, password, "register data");
});
