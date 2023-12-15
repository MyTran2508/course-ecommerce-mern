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
} = require("../controller/courseController");
const multer = require("multer");
const { PATH_COURSE_IMAGE } = require("../utils/awsS3Constant");
const { PATH_COURSE_VIDEO } = require("../utils/awsS3Constant");
const uploadImage = multer({ dest: PATH_COURSE_IMAGE });
const uploadVideo = multer({ dest: PATH_COURSE_VIDEO });

router.get(ApiResources.GET_BY_ID, getById);
router.post(ApiResources.ADD, add);
router.put(ApiResources.UPDATE, update);
router.get("/download", loadFile);
router.post("/images", uploadImage.single("file"), uploadCourseImage);
router.post("/videos", uploadVideo.single("file"), uploadCourseVideo);
router.get("/newest/:topicId/:size", getNewestCourse);
router.get("/popular/:topicId/:size", getPopularCourse);
router.post("/filter", getFiltedCourse);
router.get("/get-all-by-user-id", getAllCourseProgressByUserId);

module.exports = router;
