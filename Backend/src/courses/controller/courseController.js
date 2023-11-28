const Course = require('../model/courseModel');
const Category = require('../model/courseModel');
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
const { uploadFile, getFileStream } = require('../utils/awsS3Service');
const util = require('util')
const fs = require('fs')
const unlinkFile = util.promisify(fs.unlink)
const {PATH_COURSE_IMAGE} = require('../utils/awsS3Constant')

const add = asyncHandler(async (req, res) => {
    const topicId = req?.body?.topic._id;
    const category = Category.findOne({'topics._id': topicId});
    console.log(category);
    if(category) {
        try {
            const savedCourse = await Course.create(req.body);
            const response = ResponseMapper.toDataResponseSuccess(savedCourse);
            return res.json(response);
        } catch(error) {
            console.log(error);
            throw new Error(error);
        }
    } else {
        throw new ResourceNotFoundException("Data doesn't exists");
    }
    
});

const update = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
          id,
          {
            name: req?.body?.name,
            subTitle: req?.body?.subTitle,
            price: req?.body?.price,
            level: req?.body?.level,
            language: req?.body?.language,
            content: req?.body?.content,
            urlCourseImages: req?.body?.urlCourseImages,
            urlPromotionVideos: req?.body?.urlPromotionVideos,
            topic: req?.body?.topic,
            authorName: req?.body?.authorName,
            isApproved: req?.body?.isApproved,
            updated: new Date().getTime()
          },
          {
            new: true
          }
        );
        const response = ResponseMapper.toDataResponseSuccess(updatedCourse);
        res.json(response);
    } catch(error) {
        console.log(error);
        throw new ResourceNotFoundException(id + " does not exists in DB");
    }
})

const getById = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const category = await Course.findById(id);
    if(category) {
        const response = ResponseMapper.toDataResponseSuccess(category);
        res.json(response);
    } else {
        throw new DataNotFoundException(id + " does not exists");
    }
})

const getNewestCourse = asyncHandler(async (req, res) => {
    const topicId = req.params.topicId;
    const size = req.params.size
    console.log('Vao day');
    try {
        const courses = await Course.find({'topic._id': topicId})
        .sort({ created: -1 })
        .limit(size);
        const response = ResponseMapper.toListResponseSuccess(courses);
        res.json(response);
    } catch(error) {
        console.log(error);
        throw new Error(error);
    }
})

const getPopularCourse = asyncHandler(async (req, res) => {

})

const getFiltedCourse = asyncHandler(async (req, res) => {

})

const loadFile = asyncHandler(async (req, res) => {
    const filePath = req.query.path;
    const readStream = await getFileStream(filePath);
    readStream.pipe(res)
})

const uploadCourseImage = asyncHandler(async (req, res) => {
    try {
        const file = req.file
        console.log(file);
        const result = await uploadFile(file);
        await unlinkFile(file.path)
        const response = ResponseMapper.toDataResponseSuccess(result);
        res.json(response);
    } catch(error) {
        console.log(error);
    }
    
})

const uploadCourseVideo = asyncHandler(async (req, res) => {
    try {
        const file = req.file
        console.log(file);
        const result = await uploadFile(file);
        await unlinkFile(file.path)
        const response = ResponseMapper.toDataResponseSuccess(result);
        res.json(response);
    } catch(error) {
        console.log(error);
    }
})

const getAllCourseProgressByUserId = asyncHandler(async (req, res) => {

})

module.exports = {add, update, getById, getNewestCourse, getPopularCourse, 
    getFiltedCourse, loadFile, uploadCourseImage, uploadCourseVideo, getAllCourseProgressByUserId};