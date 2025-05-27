const { app } = require("./app");
require("dotenv").config();
const conectDB = require("./config");

conectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(
        `server is runing port ${process.env.HOST}:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection Failed !!!`, err);
  });
