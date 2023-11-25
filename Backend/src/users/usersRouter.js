const express = require("express");
const router = express.Router();

router.use("/user", require("./router/userRouter"));
router.use("/order", require("./router/userRouter"));

module.exports = router;
