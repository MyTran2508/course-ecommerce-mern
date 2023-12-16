const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
const { authMiddleware } = require("../../common/middlewares/authMiddleware");
const multer = require("multer");
const {
  createUser,
  getAllUser,
  updateUser,
  setActiveUser,
  getByUsername,
  sendOtpRegister,
  verifyAndSaveRegister,
  changePassword,
  sendOtpForgetPass,
  verifyAndSaveForgetPass,
  searchByKeyword,
  getAvatar,
  uploadAvatar,
  login,
  updateUserAdmin,
} = require("../controller/userController");

const storage = multer.memoryStorage();
const uploadImg = multer({ storage: storage });

router.post(ApiResources.ADD, authMiddleware, createUser);
router.get(ApiResources.GET_ALL, authMiddleware, getAllUser);
router.put(ApiResources.UPDATE, authMiddleware, updateUser);
router.put(ApiResources.REMOVED, authMiddleware, setActiveUser);
router.get("/get-by-username/:username", getByUsername);
router.post("/register/send-otp", sendOtpRegister);
router.post("/register/verify-save", verifyAndSaveRegister);
router.put("/change-password/:id", authMiddleware, changePassword);
router.post("/forget-password/send-otp", sendOtpForgetPass);
router.post("/forget-password/verify", verifyAndSaveForgetPass);
router.get("/photos/:username", authMiddleware, getAvatar);
router.post(
  "/photos/:username",
  authMiddleware,
  uploadImg.single("file"),
  uploadAvatar
);
router.post("/login", login);
router.post("/search-by-keyword", authMiddleware, searchByKeyword);
router.put("/update-admin", authMiddleware, updateUserAdmin);
module.exports = router;
