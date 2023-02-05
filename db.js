const mongoose = require("mongoose");

const connectToDb = () => {
  try {
    mongoose.set("strictQuery", true);
    const url = process.env.MONGO;
    mongoose.connect(url, () => console.log("db connected successfully"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDb;
