const mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = topicSchema;
