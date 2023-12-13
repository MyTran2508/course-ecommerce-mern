const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

//Export the model
module.exports = topicSchema;
