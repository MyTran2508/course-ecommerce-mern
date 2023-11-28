const mongoose = require('mongoose'); // Erase if already required
const descriptionSchema = require('./descriptionModel');
const sectionSchema = require('./sectionModel');

// Declare the Schema of the Mongo model
var contentSchema = new mongoose.Schema({
    description: {
        type: descriptionSchema,
        default: {}
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    created: {
        type: Number
    },
    updated: {
        type: Number
    },
});

contentSchema.pre("save", async function (next) {
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
});

//Export the model
module.exports = mongoose.model('Content', contentSchema);