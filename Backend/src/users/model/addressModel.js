const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema({
    addressLine:{
        type: String,
    },
    postalCode:{
        type: String,
    },
    defaultAddress:{
        type: Boolean,
    },
});

//Export the model
module.exports = addressSchema;