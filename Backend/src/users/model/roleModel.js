const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const RoleSchema = new mongoose.Schema({
    roleId: {
      type: String,
      enum: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'], // Thay đổi các giá trị enum theo nhu cầu của bạn
      default: 'ROLE_USER'
    }
});
  

//Export the model
module.exports = RoleSchema;