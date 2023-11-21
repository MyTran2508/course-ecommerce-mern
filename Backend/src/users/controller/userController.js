const User = require("../model/userModel");
const Address = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const {ResponseMapper} = require("../../common/response/ResponseMapper")
const validateId = require("../../common/utils/validateId")

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
  if (!users || users.length === 0) {
    try {
      const newUser = await User.create(req.body);
      response = ResponseMapper.toDataResponseSuccess(newUser);
      res.status(200).json(response);
    } catch(error) {
      throw new Error(error);
    }
  } else {
    throw new DataAlreadyExistException("Username or email already exists");
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    response = ResponseMapper.toDataResponseSuccess(getUsers);
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        username: req?.body?.username,
        roles: req?.body?.roles,
        addresses: req?.body?.addresses
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
})

const setRemovedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        removed: true
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
})

module.exports = { createUser, getAllUser, updateUser, setRemovedUser };