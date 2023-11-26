const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const { add, getAll, getById} = require("../controller/orderController")

router.post(ApiResources.ADD, add);
router.get(ApiResources.GET_ALL, getAll);
router.get(ApiResources.GET_BY_ID, getById);

module.exports = router;
