const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    collation: "topics",
  }
);

//Export the model
module.exports = topicSchema;
