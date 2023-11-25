const mongoose = require('mongoose'); // Erase if already required
const lectureSchema = require('./lectureModel');

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
        default: []
    },
});

//Export the model
module.exports = sectionSchema;