const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
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
  getAll,
} = require("../controller/courseController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");
const multer = require("multer");
const { PATH_COURSE_IMAGE } = require("../utils/awsS3Constant");
const { PATH_COURSE_VIDEO } = require("../utils/awsS3Constant");
const uploadImage = multer({ dest: PATH_COURSE_IMAGE });
const uploadVideo = multer({ dest: PATH_COURSE_VIDEO });

router.get(ApiResources.GET_ALL, getAll);
router.get(ApiResources.GET_BY_ID, authMiddleware, getById);
router.post(ApiResources.ADD, authMiddleware, add);
router.put(ApiResources.UPDATE, authMiddleware, update);
router.get("/download", loadFile);
router.post(
  "/images",
  authMiddleware,
  uploadImage.single("file"),
  uploadCourseImage
);
router.post(
  "/videos",
  authMiddleware,
  uploadVideo.single("file"),
  uploadCourseVideo
);
router.get("/newest/:topicId/:size", getNewestCourse);
router.get("/popular/:topicId/:size", getPopularCourse);
router.post("/filter", getFiltedCourse);
router.get("/get-all-by-user-id", authMiddleware, getAllCourseProgressByUserId);
router.post("/update-approved", authMiddleware, updateIsApproved);
router.post(
  "/update-awaiting-approval",
  authMiddleware,
  updateAwaitingApproval
);
router.post("/search-by-keyword", authMiddleware, searchByKeyword);
module.exports = router;
