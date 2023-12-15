const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(process.env.MONGODB_URL);
    mongoose.connection.on("connected", () => {
      console.log("Mongo connected");
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongo connection error:", err);
    });
  } catch (error) {
    throw new Error("Database Error");
  }
};

module.exports = dbConnect;
