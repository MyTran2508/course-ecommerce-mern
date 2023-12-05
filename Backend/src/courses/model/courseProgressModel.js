const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var courseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  currentProgress: {
    type: Number,
  },
  totalAmountOfLecture: {
    type: Number,
  },
  rateProgress: {
    type: Number,
  },
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

courseProgressSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (ret.courseId) {
      ret.course = { id: ret.courseId };
      delete ret.courseId;
    }
    if (ret.userId) {
      ret.userId = { id: ret.userId };
    }
  },
});

courseProgressSchema.pre("save", async function (next) {
  this.created = new Date().getTime();
  this.updated = new Date().getTime();
  let rate = this.currentProgress / this.totalAmountOfLecture;
  this.rateProgress = Math.round(rate * 100.0) / 100.0;
});

courseProgressSchema.findPopularCourses = async function() {
    const courses = await this.aggregate([
        {
            $group: {
                _id: '$courseId',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    return courses;
}

//Export the model
module.exports = mongoose.model("CourseProgress", courseProgressSchema);
