const User = require("../../users/model/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { NotPermissionException } = require("../error/throwExceptionHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findOne({ username: decoded?.username });
        req.user = user;
        next();
      }
    } catch (error) {
      throw new NotPermissionException(
        "Not Authorized token expired, Please login again"
      );
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  // console.log(req.user);
  const adminUser = await User.findOne({ email });
  if (false && adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
