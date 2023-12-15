const express = require("express");
const router = express.Router();
const { ApiResources } = require("../../common/message/ApiResource");
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

router.post(ApiResources.ADD, createUser);
router.get(ApiResources.GET_ALL, getAllUser);
router.put(ApiResources.UPDATE, updateUser);
router.put(ApiResources.REMOVED, setActiveUser);
router.get("/get-by-username/:username", getByUsername);
router.post("/register/send-otp", sendOtpRegister);
router.post("/register/verify-save", verifyAndSaveRegister);
router.put("/change-password/:id", changePassword);
router.post("/forget-password/send-otp", sendOtpForgetPass);
router.post("/forget-password/verify", verifyAndSaveForgetPass);
router.get("/photos/:username", getAvatar);
router.post("/photos/:username", uploadImg.single("file"), uploadAvatar);
router.post("/login", login);
router.post("/search-by-keyword", searchByKeyword);
router.put("/update-admin", updateUserAdmin);
module.exports = router;
