const Course = require("../model/courseModel");
const User = require("../../users/model/userModel");
const Category = require("../model/categoryModel");
const CourseProgress = require("../model/courseProgressModel");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const mongoose = require("mongoose");
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
    const savedCourse = await Course.create({
      name: req.body.name,
      level: req.body.level.id,
      language: req.body.language.id,
      authorName: req.body.authorName,
      topic: req.body.topic,
    });
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
  const course = await Course.findById(id).populate(["level", "language"]);
  if (course) {
    // const category = await Category.findOne({ "topics._id": course.topic._id });

    // for (const topic of category.topics) {
    //   if (topic._id.toString() === course.topic._id.toString()) {
    //     course.topic = topic;
    //     break;
    //   }
    // }

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
    const courses = await Course.find({
      "topic._id": topicId,
      isApproved: true,
    })
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

const getPopularCourse = asyncHandler(async (req, res) => {
  const topicId = req.params.topicId;
  const size = req.params.size;

  try {
    const pageSize = Number(size);
    const topicObjectId = mongoose.Types.ObjectId(topicId);

    const pipeline = [
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $match: {
          "course.topic._id": topicObjectId,
          "course.isApproved": true,
        },
      },
      {
        $group: {
          _id: "$course._id",
          count: { $sum: 1 },
          course: { $first: "$course" },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          course: { $arrayElemAt: ["$course", 0] },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: pageSize,
      },
    ];

    const results = await CourseProgress.aggregate(pipeline).exec();

    const courses = results.map((item) => item.course);
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

    return res.json(ResponseMapper.toListResponseSuccess(courses));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// lấy danh sách khóa học theo topicId
const getFiltedCourse = asyncHandler(async (req, res) => {
  const { pageIndex, pageSize, levelIds, languageIds, topicIds, keyword } =
    req.body;
  try {
    const { data, totalItems } = await Course.filterCourses(
      pageIndex,
      pageSize,
      levelIds,
      languageIds,
      topicIds,
      keyword
    );

    const page = {
      data: data,
      totalItems: totalItems,
      pageSize: data.length !== 0 ? pageSize : 0,
    };
    const response = ResponseMapper.toPagingResponseSuccess(page);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const loadFile = asyncHandler(async (req, res) => {
  const filePath = req.query.path || "";
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
