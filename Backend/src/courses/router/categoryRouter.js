const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const {
  add,
  update,
  getAll,
  getById,
  getByName,
  setRemoved,
} = require("../controller/categoryController");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");

router.get(ApiResources.GET_ALL, authMiddleware, getAll);
router.post(ApiResources.ADD, authMiddleware, add);
router.put(ApiResources.UPDATE, authMiddleware, update);
router.get(ApiResources.GET_BY_ID, authMiddleware, getById);
router.get("/get-by-name/:name", authMiddleware, getByName);
router.put(ApiResources.REMOVED, authMiddleware, setRemoved);

module.exports = router;
