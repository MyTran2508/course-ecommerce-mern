const mongoose = require('mongoose'); // Erase if already required
const levelSchema = require('./levelModel');
const languageSchema = require('./languageModel');
const topicSchema = require('./topicModel');

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    subTitle: {
        type:String,
    },
    price: {
        type:Number,
    },
    level: {
        type: levelSchema,
        default: function () {
            return [
                {
                    name: 'All Level'
                }
            ];
        }
    },
    language: {
        type: languageSchema,
        default: function () {
            return [
                {
                    name: 'Vietnamese'
                }
            ];
        }
    },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    urlCourseImages: {
        type:String,
    },
    urlPromotionVideos: {
        type:String,
    },
    topic: {
        type: topicSchema,
        require: true
    },
    authorName: {
        type:String,
    },
    isApproved: {
        type: Boolean,
        default: false
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

courseSchema.pre("save", async function (next) {
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
});

//Export the model
module.exports = mongoose.model('Course', courseSchema);