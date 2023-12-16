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
const { PATH_COURSE_LECTURE } = require("../utils/awsS3Constant");
const multer = require("multer");
const upload = multer({ dest: PATH_COURSE_LECTURE, createFolders: true });

router.post("/upload", upload.any(), uploadFileSection);
router.post(ApiResources.ADD, add);
router.put(ApiResources.UPDATE, update);
router.get(ApiResources.GET_BY_ID, getById);

router.get("/download", loadFile);

module.exports = router;
