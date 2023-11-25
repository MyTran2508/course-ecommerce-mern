const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const RoleSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      enum: ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANAGER"],
      default: "ROLE_USER",
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

RoleSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

//Export the model
module.exports = RoleSchema;
