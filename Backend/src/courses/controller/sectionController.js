const Section = require('../model/sectionModel');
const Content = require('../model/contentModel');
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

const add = asyncHandler(async (req, res) => {
    const contentId = req?.body?.content;
    const content = await Content.findById(contentId);
    if(content) {
        const savedSection = await Section.create(req.body);
        await Content.findByIdAndUpdate(
            contentId,
            {
                $push: { sections: savedSection._id }
            },
            {
                new: true
            }
        )
        const response = ResponseMapper.toDataResponseSuccess(savedSection);
        res.json(response);
    } else {
        throw new ResourceNotFoundException("Data doesn't exists");
    }
})

const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSection = await Section.findByIdAndUpdate(
            id,
            {
                name: req?.body?.name,
                ordinalNumber: req?.body?.ordinalNumber,
                lectures: req?.body?.lectures,
            },
            {
                new: true
            }
        )

        const updatedNewSection = await Section.findByIdAndUpdate(
            id,
            {
                totalDurationVideoLectures: updatedSection.lectures.reduce((total, lecture) => total + lecture.videoDuration, 0)
            },
            {
                new: true
            }
        )

        const response = ResponseMapper.toDataResponseSuccess(updatedNewSection);
        res.json(response);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    
})

const getById = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const savedSection = await Section.findById(id);
    if(savedSection) {
        const response = ResponseMapper.toDataResponseSuccess(savedSection);
        res.json(response);
    } else {
        throw new ResourceNotFoundException("Data doesn't exists");
    }
})

const uploadFileSection = asyncHandler(async (req, res) => {
    
})

const loadFile = asyncHandler(async (req, res) => {

})

module.exports = { add, update, uploadFileSection, loadFile, getById };