const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var levelSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert', 'All Level'],
        default: 'All Level'
    },
});

//Export the model
module.exports = levelSchema