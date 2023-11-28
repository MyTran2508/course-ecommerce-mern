const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var languageSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Vietnamese', 'English'],
        default: 'Vietnamese',
    },
});

//Export the model
module.exports = languageSchema