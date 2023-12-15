const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(process.env.MONGODB_URL, () => {
      console.log("Mongo connected");
    });
  } catch (error) {
    throw new Error("Database Error");
  }
};

module.exports = dbConnect;
