const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Use unique filename to avoid overwrite
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e5);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, base + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
