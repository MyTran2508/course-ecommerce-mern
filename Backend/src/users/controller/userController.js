
const User = require("../model/userModel");
const Address = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper")
const multer = require('multer');
const validateId = require("../../common/utils/validateId")
const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const { StorageService } = require("../../common/service/storageService");
// const bcrypt = require("../../common/utils/bcrypt");



const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
// const { StatusMessage } = require("../../common/message/StatusMessage");

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
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new DataAlreadyExistException("Username or email already exists");
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getAllUser = await User.find({});
    response = ResponseMapper.toDataResponseSuccess(getAllUser);
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
    response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch (error) {
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
    response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
})

const getByUsername = asyncHandler(async (req, res) => {
  // Output: DataResponse<User>
  try {
    const getByUsername = await User.findOne({ username: req.params.username });
    // console.log(getByUsername);
    response = ResponseMapper.toDataResponseSuccess(getByUsername);
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
  }
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
  try {
    const { id } = req.params;
    validateId(id);
    if (!req.body) {
      throw new Error("Please enter old password and new password!");
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Please enter old password and new password!");
    }
    changePassword = await User.findById(id);
    if (!changePassword) {
      throw new Error("User not found!");
    }
    const isMatch = await changePassword.isPasswordMatched(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect!");
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    changePassword.password = hashPassword;
    await changePassword.save();
    response = ResponseMapper.toDataResponseSuccess("Change password successfully!");
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error);

  }
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
  try {
    const storageService = new StorageService();
    const image = await storageService.loadImageFromFileSystem(req.params.username);
    if (!image) {
      throw new Error("Image not found!");
    }
    const imageBase64 = image.toString('base64');
    const response = ResponseMapper.toDataResponseSuccess(imageBase64);
    res.status(200).json(response);
  }
  catch (error) {
    throw new Error(error);
  }
})

const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    const storageService = new StorageService();
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      throw new Error('User not found!');
    }
    if (!req.body.file) {
      return ResponseMapper.toDataResponse(
        "Please upload a file!",
        StatusCode.DATA_NOT_MAP,
        StatusMessage.DATA_NOT_MAP
      );
    }
    const filePath = await storageService.uploadImageToFileSystem(req.body.file);
    console.log(filePath);
    if (filePath.isEmpty()) {
      const response = ResponseMapper.toDataResponse(
        "Invalid file format!",
        StatusCode.DATA_NOT_MAP,
        StatusMessage.DATA_NOT_MAP
      );
      res.status(400).json(response);
    }
    user.setPhotos(filePath);
    await user.save();
    const response = ResponseMapper.toDataResponseSuccess("Upload avatar successfully!");
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error.message);
  }
}
);
module.exports = {
  createUser, getAllUser, updateUser, setRemovedUser,
  getByUsername, sendOtpRegister, verifyAndSaveRegister, changePassword, sendOtpForgetPass,
  verifyAndSaveForgetPass, searchByKeyword, getAvatar, uploadAvatar
};
