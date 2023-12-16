const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
  add,
  update,
  getById,
  getByCourseId,
} = require("../controller/contentController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");
router.post(ApiResources.ADD, authMiddleware, add);
router.put(ApiResources.UPDATE, authMiddleware, update);
router.get(ApiResources.GET_BY_ID, authMiddleware, getById);
router.get("/get-by-course-id", getByCourseId);

module.exports = router;
