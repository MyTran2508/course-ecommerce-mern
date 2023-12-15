const mongoose = require("mongoose"); // Erase if already required
const lectureSchema = require("./lectureModel");

// Declare the Schema of the Mongo model
var sectionSchema = new mongoose.Schema({
  ordinalNumber: {
    type: Number,
  },
  name: {
    type: String,
  },
  lectures: {
    type: [lectureSchema],
    default: [],
  },
  totalDurationVideoLectures: {
    type: Number,
  },
  content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
});

sectionSchema.pre("save", async function (next) {
  this.totalDurationVideoLectures = this.lectures.reduce(
    (total, lecture) => total + lecture.videoDuration,
    0
  );
});

//Export the model
module.exports = mongoose.model("Section", sectionSchema);
