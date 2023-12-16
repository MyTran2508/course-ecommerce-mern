const Course = require("../model/courseModel");
const User = require("../../users/model/userModel");
const Category = require("../model/categoryModel");
const CourseProgress = require("../model/courseProgressModel");
const CourseIssueReport = require("../model/courseIssueReportModel");
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
  const course = await Course.findById(id).populate([
    "level",
    "language",
    "topic",
    "courseIssueReports",
  ]);
  course.courseIssueReports.sort((a, b) => b.created - a.created);
  const response = await ResponseMapper.toDataResponseSuccess(course);
  return res.json(response);
};

const getNewestCourse = asyncHandler(async (req, res) => {
  const topicId = req.params.topicId;
  const size = req.params.size;
  try {
    const courses = await Course.find({
      topic: topicId,
      isApproved: true,
    })
      .populate(["level", "language", "topic"])
      .sort({ created: -1 })
      .limit(size);

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
          "course.topic": topicObjectId,
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

    let results = await CourseProgress.aggregate(pipeline).exec();

    results = results.map((item) => item.course);

    await Course.populate(results, { path: "language" });
    await Course.populate(results, { path: "level" });
    await Course.populate(results, { path: "topic" });

    return res.json(ResponseMapper.toListResponseSuccess(results));
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

const streamToBase64 = async (readStream) => {
  const chunks = [];
  for await (const chunk of readStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("base64");
};

const loadFile = asyncHandler(async (req, res) => {
  const filePath = req.query.path || "";
  const readStream = await getFileStream(filePath);
  if (!readStream) {
    throw new ResourceNotFoundException("Data doesn't exists");
  }
  const base64Data = await streamToBase64(readStream);
  res.json(base64Data);
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

const updateIsApproved = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const isApproved = req.query.isApproved;
  const courseIssueReport = req.body;
  const course = await Course.findById(id);
  if (!course) {
    throw new ResourceNotFoundException("Course doesn't exists.");
  }
  if (isApproved == true) {
    if (course.isCompletedContent && course.isAwaitingApproval) {
      course.isApproved = true;
      await course.save();
      return res.json(
        ResponseMapper.toDataResponseSuccess("Update successful")
      );
    } else {
      return res.json(
        ResponseMapper.toDataResponse(
          "Content is in incompleted",
          StatusCode.DATA_NOT_MAP,
          StatusCode.DATA_NOT_MAP
        )
      );
    }
  } else {
    courseIssueReport.course = course._id;
    const savedCourseIssueReport = await CourseIssueReport.create(
      courseIssueReport
    );
    course.courseIssueReports.push(savedCourseIssueReport);
    course.isAwaitingApproval = false;
    await course.save();
    res.json(ResponseMapper.toDataResponseSuccess("Update successful"));
  }
});

const updateAwaitingApproval = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const isAwaitingApproval = req.query.isAwaitingApproval;

  const course = await Course.findById(id).populate({
    path: "content",
    populate: {
      path: "sections",
      model: "Section",
    },
  });

  if (!course) {
    throw new ResourceNotFoundException("Course doesn't exists.");
  }
  if (isAwaitingApproval && (await updateCompletedContent(course)) == false) {
    return res.json(
      ResponseMapper.toDataResponse(
        "Course content is incomplete",
        StatusCode.DATA_NOT_MAP,
        StatusMessage.DATA_NOT_MAP
      )
    );
  } else {
    course.isAwaitingApproval = isAwaitingApproval;
    await course.save();
    res.json(ResponseMapper.toDataResponseSuccess("Update succcessful"));
  }
});

const updateCompletedContent = async (course) => {
  if (!course.isCompletedContent) {
    if (
      course.content &&
      course.content.description &&
      course.content.sections.length > 0 &&
      course.content.sections[0].lectures.length > 0
    ) {
      course.isCompletedContent = true;
      await course.save();
    } else {
      return false;
    }
  }
  return true;
};

const searchCourse = async (keywords, pageable) => {
  const name = keywords[0];
  const authorName = keywords[1];
  const isApproved = keywords[2];
  const isAwaitingApproval = keywords[3];
  const isCompletedContent = keywords[4];

  const query = {};
  if (name !== null && name !== undefined) {
    query.$or = [
      { name: { $regex: new RegExp(name, "i") } },
      { subTitle: { $regex: new RegExp(name, "i") } },
    ];
  }

  if (authorName !== null && authorName !== undefined) {
    query.authorName = authorName;
  }

  if (isApproved !== null && isApproved !== undefined) {
    query.isApproved = isApproved;
  }

  if (isAwaitingApproval !== null && isAwaitingApproval !== undefined) {
    query.isAwaitingApproval = isAwaitingApproval;
  }

  if (isCompletedContent !== null && isCompletedContent !== undefined) {
    query.isCompletedContent = isCompletedContent;
  }

  let searchQuery = await Course.find(query)
    .populate(["courseIssueReports", "level", "language", "topic"])
    .sort(pageable.sort)
    .skip(pageable.pageIndex * pageable.pageSize)
    .limit(pageable.pageSize)
    .exec();

  let results = await searchQuery;
  results.forEach((course) => {
    course.courseIssueReports.sort((a, b) => b.created - a.created);
  });

  return {
    data: results,
    pageIndex: pageable.pageIndex,
    pageSize: pageable.pageSize,
    totalItems: await Course.countDocuments(query).exec(),
  };
};

const searchByKeyword = async (req, res) => {
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

  const results = await searchCourse(searchByKeywordDto.keyword, pageRequest);

  res.json(ResponseMapper.toPagingResponseSuccess(results));
};

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
  updateIsApproved,
  updateAwaitingApproval,
  searchByKeyword,
};
