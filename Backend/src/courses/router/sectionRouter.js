const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const {add, update, getById, uploadFileSection, loadFile} = require('../controller/sectionController');

router.post(ApiResources.ADD, add);
router.put(ApiResources.UPDATE, update);
router.get(ApiResources.GET_BY_ID, getById);
router.post("/upload", uploadFileSection);
router.get("/download", loadFile)

module.exports = router