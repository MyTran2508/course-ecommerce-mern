const Course = require('../model/courseModel');
const CourseProgress = require('../model/courseProgressModel');
const asyncHandler = require("express-async-handler");
const {ResponseMapper} = require("../../common/response/ResponseMapper")
const validateId = require("../../common/utils/validateId")
const {StatusCode} = require('../../common/message/StatusCode')
const {StatusMessage} = require('../../common/message/StatusMessage')
const {
    DataAlreadyExistException,
    DataNotFoundException,
    ResourceNotFoundException,
    NotPermissionException,
} = require("../../common/error/throwExceptionHandler");

const hasAccessToCourse = asyncHandler(async (req, res) => {

})

const updateCurrentProgress = asyncHandler(async (req, res) => {

})

const getByUserIdAndCourseId = asyncHandler(async (req, res) => {

})

const setRemoved = asyncHandler(async (req, res) => {

})

module.exports = {hasAccessToCourse, updateCurrentProgress, getByUserIdAndCourseId, setRemoved}