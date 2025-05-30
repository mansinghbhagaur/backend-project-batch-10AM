const { asyncHandler } = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const allData = req.body;
  console.log(allData, "register data");
});

module.exports = {
  register,
};
