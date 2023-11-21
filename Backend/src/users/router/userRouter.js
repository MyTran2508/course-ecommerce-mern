const express = require("express");
const router = express.Router();
const { ApiResources } = require('../../common/message/ApiResource') 
const { createUser, getAllUser, updateUser, setRemovedUser } = require("../controller/userController")

router.post(ApiResources.ADD, createUser);
router.get(ApiResources.GET_ALL, getAllUser);
router.put(ApiResources.UPDATE, updateUser)
router.put(ApiResources.REMOVED, setRemovedUser);

module.exports = router;
