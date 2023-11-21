const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
const Address = require("./addressModel")
const RoleSchema = require("./roleModel")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      require: true,
      index: true
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    telephone: {
      type: String,
    },
    photos: {
      type: String,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [RoleSchema],
      default: function () {
        return [
          {
            roleId: 'ROLE_USER'
          }
        ];
      }
    },
    addresses: {
      type: [Address],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Export the model
module.exports = mongoose.model("User", userSchema);
