const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const { createUser } = require("../controller/userController")

router.post(ApiResources.ADD, createUser);

module.exports = router;
