const mongoose = require('mongoose'); // Erase if already required
const topicSchema = require('./topicModel');

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
    },
    topics: {
        type: [topicSchema],
        default: []
    },
    removed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Category', categorySchema);