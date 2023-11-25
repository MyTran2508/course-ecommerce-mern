const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var descriptionSchema = new mongoose.Schema({
    requirements: {
        type:String,
    },
    details: {
        type:String,
    },
    targetConsumers: {
        type:String,
    },
});

//Export the model
module.exports = descriptionSchema