const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
  add,
  update,
  getById,
  uploadFileSection,
  loadFile,
} = require("../controller/sectionController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");
const { PATH_COURSE_LECTURE } = require("../utils/awsS3Constant");
const multer = require("multer");
const upload = multer({ dest: PATH_COURSE_LECTURE, createFolders: true });

router.post("/upload", authMiddleware, upload.any(), uploadFileSection);
router.post(ApiResources.ADD, authMiddleware, add);
router.put(ApiResources.UPDATE, authMiddleware, update);
router.get(ApiResources.GET_BY_ID, authMiddleware, getById);

router.get("/download", loadFile);

module.exports = router;
