const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true,
    },
    description: {
        type:String,
    },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = topicSchema;