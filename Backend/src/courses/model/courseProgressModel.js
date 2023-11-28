const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var courseProgressSchema = new mongoose.Schema({
    userId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    courseId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
    currentProgress: {
        type: Number
    },
    totalAmountOfLecture: {
        type: Number
    },
    rateProgress: {
        type: Number
    },
    removed: {
        type: Boolean,
        default: false
    },
    created: {
        type: Number
    },
    updated: {
        type: Number
    }
});


courseProgressSchema.pre("save", async function (next) {
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
    let rate = this.currentProgress / this.totalAmountOfLecture;
    this.rateProgress = Math.round(rate * 100.0) / 100.0;
});

//Export the model
module.exports = mongoose.model('CourseProgress', courseProgressSchema);