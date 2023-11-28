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
    },
    created: {
        type: Number
    },
    updated: {
        type: Number
    }
});

categorySchema.pre("save", async function (next) {
    this.created = new Date().getTime();
    this.updated = new Date().getTime();
});


categorySchema.pre('updateOne', function(next) {
    this.updated = new Date().getTime();
});
  
categorySchema.pre('updateMany', function(next) {
    this.updated = new Date().getTime();
});
  

//Export the model
module.exports = mongoose.model('Category', categorySchema);