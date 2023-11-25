const User = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
import sendMail from "../utils/mailUtil";
import { generateOTP, validateOTP } from "../utils/otpUtil";
import { StatusCode } from "../../common/message/StatusCode";
import { StatusMessage } from "../../common/message/StatusMessage";
import typeMessage from "../utils/typeMessage";

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
    } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const getByUsername = asyncHandler(async (req, res) => {
  // Output: DataResponse<User>
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
  // Input: username
  // Output: base64 image
});

const uploadAvatar = asyncHandler(async (req, res) => {
  // Input: params username, MultipartFile
  // Output DataResponse<String> (is filePath to image)
});

module.exports = {
  createUser,
  getAllUser,
  updateUser,
  setRemovedUser,
  getByUsername,
  sendOtpRegister,
  verifyAndSaveRegister,
  changePassword,
  sendOtpForgetPass,
  verifyAndSaveForgetPass,
  searchByKeyword,
  getAvatar,
  uploadAvatar,
};
