const mongoose = require('mongoose'); // Erase if already required
const descriptionSchema = require('./descriptionModel');
const sectionSchema = require('./sectionModel');

// Declare the Schema of the Mongo model
var contentSchema = new mongoose.Schema({
    description: {
        type: descriptionSchema,
        default: {}
    },
    sections: {
        type: [sectionSchema],
        default: []
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

//Export the model
module.exports = mongoose.model('Content', contentSchema);