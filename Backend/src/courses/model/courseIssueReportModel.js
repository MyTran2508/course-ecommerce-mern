const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var courseIssueReportSchema = new mongoose.Schema({
  issueType: {
    type: String,
    enum: ["CONTENT_FORMAT", "FILE_ERROR", "OTHER"],
    default: "OTHER",
  },
  message: {
    type: String,
    // required: true,
  },
  severityLevel: {
    type: String,
    enum: ["NONE", "LOW", "MEDIUM", "HIGH"],
    default: "NONE",
  },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  removed: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Number,
  },
  updated: {
    type: Number,
  },
});

courseIssueReportSchema.pre("save", async function (next) {
  this.created = new Date().getTime();
  this.updated = new Date().getTime();
  next();
});

//Export the model
module.exports = mongoose.model("CourseIssueReport", courseIssueReportSchema);
