
const User = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const {  ResponseMapper  } = require("../../common/response/ResponseMapper");
const multer = require('multer');
const validateId = require("../../common/utils/validateId");const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const { StorageService } = require("../../common/service/storageService");
const {cloudinary} = require("../../common/config/cloudinary");
// const bcrypt = require("../../common/utils/bcrypt");



const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
import sendMail from "../utils/mailUtil";
const { generateOTP, validateOTP } = require("../utils/otpUtil");
const typeMessage = require("../utils/typeMessage");
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
      const response = ResponseMapper.toDataResponseSuccess(newUser);
      res.status(200).json(response);
    } catch  (error) {
      throw new Error(error);
    }
  } else {
    throw new DataAlreadyExistException("Username or email already exists");
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getAllUser = await User.find({});
    const response = ResponseMapper.toListResponseSuccess(getAllUser);
    res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
  }
});

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
        addresses: req?.body?.addresses,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch  (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const setRemovedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        removed: true,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch  (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

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
});

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
});

const sendOtpRegister = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
  let response;
  const email = req.query.email;
  const username = req.body.username;
  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    const OTP = generateOTP(email);

    if (sendMail(email, OTP, typeMessage.REGISTER)) {
      response = ResponseMapper.toDataResponseSuccess(
        "Send otp to " + email + " successfully"
      );
    } else {
      const messageError = "An error occurred while generating and sending OTP";
      response = ResponseMapper.toDataResponse(
        messageError,
        StatusCode.NOT_IMPLEMENTED,
        StatusMessage.NOT_IMPLEMENTED
      );
    }
    return res.json(response);
  } else {
    throw new DataAlreadyExistException("Username or email already exists");
  }
});

const verifyAndSaveRegister = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
  const email = req.query.email;
  const otp = req.query.otp;

  let response;
  if (!validateOTP(email, otp)) {
    response = ResponseMapper.toDataResponse(
      "Otp is not correct",
      StatusCode.NOT_IMPLEMENTED,
      StatusMessage.NOT_IMPLEMENTED
    );
    return res.json(response);
  }
  try {
    const newUser = await User.create(req.body);
    response = ResponseMapper.toDataResponseSuccess(newUser);
    return res.status(200).json(response);
  } catch (error) {
    throw new DataAlreadyExistException("User or email already exists");
  }
});

const sendOtpForgetPass = asyncHandler(async (req, res) => {
  // Output: DataResponse<String>
  const email = req.query.email;
  const user = await User.findOne({ email: email });

  let response;
  if (!user) {
    throw new DataNotFoundException("Email is not valid");
  }

  const OTP = generateOTP(email);
  if (sendMail(email, OTP, typeMessage.FORGET_PASSWORD)) {
    response = ResponseMapper.toDataResponseSuccess(
      "Send otp to " + email + " successfully"
    );
  } else {
    response = messageError =
      "An error occurred while generating and sending OTP";
    return ResponseMapper.toDataResponse(
      messageError,
      StatusCode.NOT_IMPLEMENTED,
      StatusMessage.NOT_IMPLEMENTED
    );
  }
  return res.json(response);
});

const verifyAndSaveForgetPass = asyncHandler(async (req, res) => {
  // DataResponse<String>
  const email = req.body.email;
  const otp = req.body.otp;
  const newPassword = req.body.newPassword;

  let response;
  if (!validateOTP(email, otp)) {
    response = ResponseMapper.toDataResponse(
      "Otp is not correct",
      StatusCode.NOT_IMPLEMENTED,
      StatusMessage.NOT_IMPLEMENTED
    );
    return res.json(response);
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new DataNotFoundException("User not found");
    }

    user.password = newPassword;
    await user.save();
    response = ResponseMapper.toDataResponseSuccess(
      "Update password successfully"
    );

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});

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
});

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
});

const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    const storageService = new StorageService();
    const user = await User.findOne({ username: req.params.username });
    console.log(user);
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
