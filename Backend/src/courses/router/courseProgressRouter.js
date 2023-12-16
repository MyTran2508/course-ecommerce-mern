const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
  hasAccessToCourse,
  updateCurrentProgress,
  getByUserIdAndCourseId,
  setRemoved,
} = require("../controller/courseProgressController");

router.put(ApiResources.REMOVED, setRemoved);
router.get("/get-by-userId-courseId", getByUserIdAndCourseId);
router.get("/has-access-to-course", hasAccessToCourse);
router.post("/update-current-progress", updateCurrentProgress);

module.exports = router;
