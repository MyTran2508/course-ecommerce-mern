const User = require("../model/userModel");
const Address = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");

const createUser = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const users = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  // console.log(users);
  if (!users) {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } else {
    throw new DataAlreadyExistException("Username or email already exists");
  }
});

module.exports = { createUser };
