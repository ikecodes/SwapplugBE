const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

module.exports = () => {
  const Db = process.env.REMOTE_DATABASE;
  mongoose
    .connect(Db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("successfully connected to database 😁");
    });
};
