const mongoose = require("mongoose"); // Erase if already required
const levelSchema = require("./levelModel");
const languageSchema = require("./languageModel");
const topicSchema = require("./topicModel");

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  subTitle: {
    type: String,
  },
  price: {
    type: Number,
  },
  level: { type: mongoose.Schema.Types.ObjectId, ref: "Level" },
  language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
  content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
  urlCourseImages: {
    type: String,
  },
  urlPromotionVideos: {
    type: String,
  },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  authorName: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isCompletedContent: {
    type: Boolean,
    default: false,
  },
  isAwaitingApproval: {
    type: Boolean,
    default: false,
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

courseSchema.pre("save", async function (next) {
  this.created = new Date().getTime();
  this.updated = new Date().getTime();
});

courseSchema.statics.findPopularCourses = async function () {
  const courses = await this.find({}).sort({ price: -1 }).limit(3);
  return courses;
};

courseSchema.statics.findNewestCourses = async function () {
  const courses = await this.find({}).sort({ created: -1 }).limit(3);
  return courses;
};

courseSchema.statics.findCoursesByTopicId = async function (topicId) {
  const courses = await this.find({ "topic._id": topicId });
  return courses;
};

courseSchema.statics.filterCourses = async function (
  pageIndex,
  pageSize,
  levelIds,
  languageIds,
  topicIds,
  keyword
) {
  const query = {
    $and: [
      levelIds.length > 0 ? { level: { $in: levelIds } } : {},
      languageIds.length > 0 ? { language: { $in: languageIds } } : {},
      topicIds.length > 0 ? { topic: { $in: topicIds } } : {},
      {
        $or: [
          keyword !== null
            ? { name: { $regex: new RegExp(keyword, "i") } }
            : {},
        ],
      },
      { isApproved: true },
    ],
  };

  const courses = await this.find(query);
  const page = await this.find(query)
    .populate("level")
    .populate("language")
    .populate("topic")
    .skip(pageIndex * pageSize)
    .limit(pageSize)
    .sort({ created: -1 })
    .exec();

  return { totalItems: courses.length, data: page };
};

//Export the model
module.exports = mongoose.model("Course", courseSchema);
