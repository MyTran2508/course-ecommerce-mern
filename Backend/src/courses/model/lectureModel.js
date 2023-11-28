const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var lectureSchema = new mongoose.Schema({
    ordinalNumber: {
        type: Number,
    },
    name: {
        type:String,
    },
    url: {
        type:String,
    },
    videoDuration: {
        type: Number,
    },
});

//Export the model
module.exports = lectureSchema