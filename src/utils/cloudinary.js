const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// console.log(
//   "CLOUDINARY_NAME:",
//   process.env.CLOUDINARY_NAME,
//   "CLOUDINARY_API_KEY:",
//   process.env.CLOUDINARY_API_KEY,
//   "CLOUDINARY_API_SECRET:",
//   process.env.CLOUDINARY_API_SECRET
// );
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // console.log(localFilePath, "filepath===");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "todo_project_image",
    });
    console.log(response, "respon=====");

    // file has been uploaded successfully
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      // Ignore error if file doesn't exist
    }
    return null;
  }
};

module.exports = uploadOnCloudinary;
