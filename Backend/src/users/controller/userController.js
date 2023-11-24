const User = require("../model/userModel");
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
      const response = ResponseMapper.toDataResponseSuccess(newUser);
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
    const response = ResponseMapper.toListResponseSuccess(getUsers);
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
        telephone: req?.body?.telephone,
        roles: req?.body?.roles,
        addresses: req?.body?.addresses
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch(error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
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
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch(error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
})

const getByUsername = asyncHandler(async (req, res) => {
  // Output: DataResponse<User>
})

const changePassword = asyncHandler(async (req, res) => {
  /*
  Input: 
  params: ID
  ChangePasswordRequest {
    oldPassword: 'key',
    newPassword: 'key',
  }
  */
  // Output: DataResponse<String>
})

const sendOtpRegister = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
})

const verifyAndSaveRegister = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
})

const sendOtpForgetPass = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
})

const verifyAndSaveForgetPass = asyncHandler(async (req, res) => {
  // DataResponse<String>
})

const searchByKeyword = asyncHandler(async (req, res) => {
  /*
  Input: SearchKeywordDto {
    keyword: 'key',
    pageIndex: 1,
    pageSize: 1,
    sortBy(field): "username", (Optional)
    isDecrease: true/false (Optional)
  }
  */
})

const getAvatar = asyncHandler(async (req, res) => {
  // Input: username
  // Output: base64 image
})

const uploadAvatar = asyncHandler(async (req, res) => {
  // Input: params username, MultipartFile
  // Output DataResponse<String> (is filePath to image)
})


module.exports = { createUser, getAllUser, updateUser, setRemovedUser, 
  getByUsername, sendOtpRegister, verifyAndSaveRegister, changePassword, sendOtpForgetPass,
  verifyAndSaveForgetPass, searchByKeyword, getAvatar, uploadAvatar };
