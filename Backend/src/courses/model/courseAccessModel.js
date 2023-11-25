const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var courseAccessSchema = new mongoose.Schema({
    userId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    courseId: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
});

//Export the model
module.exports = mongoose.model('CourseAccess', courseAccessSchema);