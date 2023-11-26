const express = require("express");
const router = express.Router();

router.use("/course", require("./router/courseRouter"));
router.use("/section", require("./router/sectionRouter"));
router.use("/content", require("./router/contentRouter"));
router.use("/category", require("./router/categoryRouter"))

module.exports = router;
