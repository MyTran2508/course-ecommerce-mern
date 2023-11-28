const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema(
  {
    addressLine: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    defaultAddress: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);
addressSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

//Export the model
module.exports = addressSchema;
