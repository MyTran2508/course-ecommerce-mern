const User = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const multer = require("multer");
const validateId = require("../../common/utils/validateId");
const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const { StorageService } = require("../../common/service/storageService");
const { cloudinary } = require("../../common/config/cloudinary");
const { generateToken } = require("../../common/security/jwtToken");
const bcrypt = require("bcrypt");

const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
const { sendMail } = require("../utils/mailUtil");
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
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return res.json(
      ResponseMapper.toDataResponse(
        "Data already exist",
        StatusCode.DATA_CONFLICT,
        StatusMessage.DATA_CONFLICT
      )
    );
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
        addresses: req?.body?.addresses,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    return res.json(response);
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const updateUserAdmin = asyncHandler(async (req, res) => {
  const { id } = req.query;
  console.log(id);
  validateId(id);

  const savedUser = await User.findById(id);
  if (!savedUser) {
    throw new ResourceNotFoundException("Data doesn't exists");
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: req?.body?.username,
        email: req?.body?.email,
        roles: req?.body?.roles,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedUser);
    res.json(response);
  } catch (error) {
    console.log(error);
    let response = ResponseMapper.toDataResponse(
      "Data already exist",
      StatusCode.DATA_CONFLICT,
      StatusMessage.DATA_CONFLICT
    );
    res.json(response);
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json(
      ResponseMapper.toDataResponseSuccess(generateToken(findUser?._id))
    );
  } else {
    throw new NotPermissionException("invalid access");
  }
});

const setActiveUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const user = await User.findById(id);
    user.removed = !user.removed;
    await user.save();
    const response = ResponseMapper.toDataResponseSuccess(user);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const getByUsername = asyncHandler(async (req, res) => {
  // Output: DataResponse<User>
  try {
    const getByUsername = await User.findOne({ username: req.params.username });
    console.log(getByUsername);
    const response = ResponseMapper.toDataResponseSuccess(getByUsername);
    return res.status(200).json(response);
  } catch (error) {
    throw new Error(error);
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new DataNotFoundException("Data doesn't exists.");
  }
  const isMatchesPassword = await user.isPasswordMatched(oldPassword);
  if (!isMatchesPassword) {
    throw new DataNotFoundException("Old password is incorrect!");
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  await User.findByIdAndUpdate(
    id,
    {
      password: hashPassword,
    },
    {
      new: true,
    }
  );
  let response = ResponseMapper.toDataResponseSuccess(
    "Change password successfully!"
  );
  res.status(200).json(response);
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

async function searchUser(keyword, pageable) {
  const query = {
    $or: [
      { username: { $regex: new RegExp(keyword, "i") } },
      { email: { $regex: new RegExp(keyword, "i") } },
    ],
  };

  // try {
  let searchQuery = await User.find(query)
    .sort(pageable.sort)
    .skip(pageable.pageIndex * pageable.pageSize)
    .limit(pageable.pageSize)
    .exec();

  const results = await searchQuery;

  return {
    data: results,
    pageIndex: pageable.pageIndex,
    pageSize: pageable.pageSize,
    totalItems: await User.countDocuments(query).exec(),
  };
  // }
  // catch (error) {
  //   throw new Error(error.message);
  // }
}

const searchByKeyword = async (req, res) => {
  /*
  Input: SearchKeywordDto {
    keyword: 'key',
    pageIndex: 1,
    pageSize: 1,
    sortBy(field): "username", (Optional)
    isDecrease: true/false (Optional)
  }
  */
  const searchByKeywordDto = req.body;
  let sort = null;
  let pageRequest = null;
  if (searchByKeywordDto.sortBy && searchByKeywordDto.sortBy.length > 0) {
    sort = {};
    sort[searchByKeywordDto.sortBy] =
      searchByKeywordDto.isDecrease || searchByKeywordDto.isDecrease == null
        ? -1
        : 1;
  }

  if (sort) {
    pageRequest = {
      pageIndex: searchByKeywordDto.pageIndex,
      pageSize: searchByKeywordDto.pageSize,
      sort: sort,
    };
  } else {
    pageRequest = {
      pageIndex: searchByKeywordDto.pageIndex,
      pageSize: searchByKeywordDto.pageSize,
    };
  }

  const results = await searchUser(searchByKeywordDto.keyword[0], pageRequest);
  res.json(ResponseMapper.toPagingResponseSuccess(results));
};

const getAvatar = asyncHandler(async (req, res) => {
  try {
    const storageService = new StorageService();
    const image = await storageService.loadImageFromFileSystem(
      req.params.username
    );
    if (!image) {
      throw new Error("Image not found!");
    }
    const imageBase64 = image.toString("base64");
    const response = ResponseMapper.toDataResponseSuccess(imageBase64);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    const storageService = new StorageService();
    const user = await User.findOne({ username: req.params.username });
    // console.log(user);
    if (!user) {
      throw new DataNotFoundException("User not found!");
    }
    console.log(req.file);
    if (!req.file) {
      const response = ResponseMapper.toDataResponse(
        "Invalid file format!",
        StatusCode.DATA_NOT_MAP,
        StatusMessage.DATA_NOT_MAP
      );
      return res.json(response);
    }
    const filePath = await storageService.uploadImageToFileSystem(req.file);

    if (filePath === "") {
      const response = ResponseMapper.toDataResponse(
        "Invalid file format!",
        StatusCode.DATA_NOT_MAP,
        StatusMessage.DATA_NOT_MAP
      );
      return res.json(response);
    }
    await User.findByIdAndUpdate(
      user._id,
      {
        photos: filePath,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(
      "Upload avatar successfully!"
    );
    return res.json(response);
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = {
  createUser,
  getAllUser,
  updateUser,
  setActiveUser,
  getByUsername,
  sendOtpRegister,
  verifyAndSaveRegister,
  changePassword,
  sendOtpForgetPass,
  verifyAndSaveForgetPass,
  searchByKeyword,
  getAvatar,
  uploadAvatar,
  login,
  updateUserAdmin,
};
