const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
  hasAccessToCourse,
  updateCurrentProgress,
  getByUserIdAndCourseId,
  setRemoved,
} = require("../controller/courseProgressController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");

router.put(ApiResources.REMOVED, authMiddleware, setRemoved);
router.get("/get-by-userId-courseId", authMiddleware, getByUserIdAndCourseId);
router.get("/has-access-to-course", authMiddleware, hasAccessToCourse);
router.post("/update-current-progress", authMiddleware, updateCurrentProgress);

module.exports = router;
