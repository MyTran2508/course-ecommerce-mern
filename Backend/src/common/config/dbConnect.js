const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(
      "mongodb://127.0.0.1:27017/course-ecommerce",
      () => {
        console.log("Mongo connected");
      }
    );
  } catch (error) {
    throw new Error("Database Error");
  }
};

module.exports = dbConnect;
