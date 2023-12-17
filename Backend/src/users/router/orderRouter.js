const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const { add, getAll, getById } = require("../controller/orderController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");

router.post(ApiResources.ADD, authMiddleware, add);
router.get(ApiResources.GET_ALL, authMiddleware, getAll);
router.get(ApiResources.GET_BY_ID, authMiddleware, getById);

module.exports = router;
