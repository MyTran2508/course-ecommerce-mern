const Course = require("../model/courseModel");
const User = require("../../users/model/userModel");
const Category = require("../model/categoryModel");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
const { uploadFile, getFileStream } = require("../utils/awsS3Service");
const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);

const add = asyncHandler(async (req, res) => {
  const savedUser = await User.findOne({ username: req.body.authorName });
  if (!savedUser) {
    throw new ResourceNotFoundException("User doesn't exists.");
  }
  try {
    const savedCourse = await Course.create(req.body);
    const response = ResponseMapper.toDataResponseSuccess(savedCourse);
    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.json(
      ResponseMapper.toDataResponse(
        "",
        StatusCode.DATA_CONFLICT,
        StatusMessage.DATA_CONFLICT
      )
    );
  }
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        subTitle: req?.body?.subTitle,
        price: req?.body?.price,
        level: req?.body?.level,
        language: req?.body?.language,
        urlCourseImages: req?.body?.urlCourseImages,
        urlPromotionVideos: req?.body?.urlPromotionVideos,
        topic: req?.body?.topic,
        authorName: req?.body?.authorName,
        updated: new Date().getTime(),
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedCourse);
    res.json(response);
  } catch (error) {
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const getById = async (req, res) => {
  const id = req.query.id;
  const course = await Course.findById(id);
  if (course) {
    const category = await Category.findOne({ "topics._id": course.topic._id });

    for (const topic of category.topics) {
      if (topic._id.toString() === course.topic._id.toString()) {
        course.topic = topic;
        break;
      }
    }

    const response = await ResponseMapper.toDataResponseSuccess(course);
    res.json(response);
  } else {
    throw new DataNotFoundException(id + " does not exists");
  }
};

// lấy những khóa học mới nhất
const getNewestCourse = asyncHandler(async (req, res) => {
  const topicId = req.params.topicId;
  const size = req.params.size;
  try {
    const courses = await Course.find({ "topic._id": topicId })
      .sort({ created: -1 })
      .limit(size);

    for (const course of courses) {
      const category = await Category.findOne({
        "topics._id": course.topic._id,
      });
      for (const topic of category.topics) {
        if (topic._id.toString() === course.topic._id.toString()) {
          course.topic = topic;
          break;
        }
      }
    }

    const response = ResponseMapper.toListResponseSuccess(courses);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// lấy những khóa học phổ biến nhất
const getPopularCourse = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const size = req.params.size;
  try {
    const courses = await courseProgress
      .findPopularCourses({ userId: userId })
      .sort({ created: -1 })
      .limit(size);
    const response = ResponseMapper.toListResponseSuccess(courses);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// lấy danh sách khóa học theo topicId
const getFiltedCourse = asyncHandler(async (req, res) => {
  const topicId = req.params.topicId;
  const level = req.params.level;
  const language = req.params.language;
  const price = req.params.price;
  const size = req.params.size;
  try {
    const courses = await Course.filterCourses(topicId, level, language, price)
      .sort({ created: -1 })
      .limit(size);
    const response = ResponseMapper.toListResponseSuccess(courses);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const loadFile = asyncHandler(async (req, res) => {
  const filePath = req.query.path;
  const readStream = await getFileStream(filePath);
  readStream.pipe(res);
});

const uploadCourseImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const result = await uploadFile("", file);
    await unlinkFile(file.path);
    const response = ResponseMapper.toDataResponseSuccess(result);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

const uploadCourseVideo = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const result = await uploadFile("", file);
    await unlinkFile(file.path);
    const response = ResponseMapper.toDataResponseSuccess(result);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

const getAllCourseProgressByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const courses = await Course.find({ "courseProgress.userId": userId });

    for (const course of courses) {
      const category = await Category.findOne({
        "topics._id": course.topic._id,
      });
      for (const topic of category.topics) {
        if (topic._id.toString() === course.topic._id.toString()) {
          course.topic = topic;
          break;
        }
      }
    }

    const response = ResponseMapper.toListResponseSuccess(courses);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

module.exports = {
  add,
  update,
  getById,
  getNewestCourse,
  getPopularCourse,
  getFiltedCourse,
  loadFile,
  uploadCourseImage,
  uploadCourseVideo,
  getAllCourseProgressByUserId,
};
