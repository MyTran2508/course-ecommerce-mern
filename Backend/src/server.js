const express = require("express");
const dbConnect = require("./common/config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8082;
const usesRoute = require("./users/usersRouter")
const courseRouter = require("./courses/coursesRouter")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./common/error/errorHandlerMiddlewares");

// Connect to database
dbConnect();

// Config body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Route to services
app.use("/api/users", usesRoute);
app.use("/api/courses", courseRouter)


//
app.use(notFound)
app.use(errorHandler)

// Run app
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
