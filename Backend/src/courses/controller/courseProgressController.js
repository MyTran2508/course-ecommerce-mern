const Course = require("../model/courseModel");
const CourseProgress = require("../model/courseProgressModel");
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
const {
  getContentByCourseId,
} = require("../../courses/controller/contentController");

const hasAccessToCourse = asyncHandler(async (req, res) => {
  let response;
  const userId = req?.query.userId;
  const courseId = req?.query.courseId;
  try {
    const courseProcess = await CourseProgress.findOne({
      userId: userId,
      course: courseId,
    });
    if (courseProcess) {
      response = ResponseMapper.toDataResponseSuccess(true);
    } else {
      response = ResponseMapper.toDataResponseSuccess(false);
    }
  } catch (error) {
    console.log(error);
    response = ResponseMapper.toDataResponseSuccess(false);
  }
  return res.json(response);
});

const updateCurrentProgress = asyncHandler(async (req, res) => {
  let response;
  const userId = req?.query.userId;
  const courseId = req?.query.courseId;
  try {
    const courseProcess = await CourseProgress.findOne({
      userId: userId,
      course: courseId,
    });
    if (courseProcess) {
      if (courseProcess.currentProgress < courseProcess.totalAmountOfLecture) {
        courseProcess.currentProgress += 1;
        await courseProcess.save();
        response = ResponseMapper.toDataResponseSuccess(courseProcess);
      }
    } else {
      throw new ResourceNotFoundException("Data doesn't exists");
    }
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
});

const getByUserIdAndCourseId = asyncHandler(async (req, res) => {
  let response;
  const userId = req?.query.userId;
  const courseId = req?.query.courseId;
  console.log(userId, courseId);
  try {
    const courseProcess = await CourseProgress.findOne({
      userId: userId,
      course: courseId,
    });
    if (courseProcess) {
      response = ResponseMapper.toDataResponseSuccess(courseProcess);
    } else {
      throw new ResourceNotFoundException("Data doesn't exists");
    }
    return res.json(response);
  } catch (error) {
    throw new Error(error);
  }
});

const setRemoved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedCourseProcess = await CourseProgress.findByIdAndUpdate(
      id,
      {
        removed: true,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedCourseProcess);
    return res.json(response);
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const addList = async (orderItems, userId) => {
  console.log(orderItems);
  orderItems.map(async (orderItem) => {
    const content = await getContentByCourseId(orderItem.courseId);
    if (content) {
      let totalAmountOfLecture = 0;
      content.sections.map((section) => {
        totalAmountOfLecture += section.lectures.length;
      });
      const courseProcess = {
        userId: userId,
        totalAmountOfLecture: totalAmountOfLecture,
        course: orderItem.courseId,
        currentProgress: 0,
      };

      console.log(courseProcess);

      try {
        await CourseProgress.create(courseProcess);
      } catch (error) {
        console.log(error);
      }
    }
  });
};

module.exports = {
  hasAccessToCourse,
  updateCurrentProgress,
  getByUserIdAndCourseId,
  setRemoved,
  addList,
};
