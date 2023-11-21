const mongoose = require("mongoose");
const {ArgumentNotValid} = require("../error/throwExceptionHandler")
const validateId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new ArgumentNotValid("Data doesn't exist");
}

module.exports = validateId;