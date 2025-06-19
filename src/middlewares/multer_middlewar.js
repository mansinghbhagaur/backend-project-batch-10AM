const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //     const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 100000);
    //     cb(null, file.originalname + "-" + uniqueSuffix);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
