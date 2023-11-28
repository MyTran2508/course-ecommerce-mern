const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const {add, update, getById} = require('../controller/contentController');

router.post(ApiResources.ADD, add);
router.put(ApiResources.UPDATE, update);
router.get(ApiResources.GET_BY_ID, getById);

module.exports = router