const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const {add, update, getAll, getById, getByName, setRemoved} = require('../controller/categoryController');

router.get(ApiResources.GET_ALL, getAll);
router.post(ApiResources.ADD, add);
router.put(ApiResources.UPDATE, update);
router.get(ApiResources.GET_BY_ID, getById);
router.get('/get-by-name/:name', getByName);
router.put(ApiResources.REMOVED, setRemoved);

module.exports = router