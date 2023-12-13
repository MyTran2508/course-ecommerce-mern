const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderItemSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  price: {
    type: Number,
  },
});

//Export the model
module.exports = orderItemSchema;
