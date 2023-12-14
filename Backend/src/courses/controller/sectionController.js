const Section = require("../model/sectionModel");
const Content = require("../model/contentModel");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const { StatusCode } = require("../../common/message/StatusCode");
const { StatusMessage } = require("../../common/message/StatusMessage");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");
const { uploadFile, getFileStream } = require("../utils/awsS3Service");
const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);
const {
  PATH_COURSE_LECTURE,
  PATH_COURSE_DOCUMENT,
} = require("../utils/awsS3Constant");
const { isDocument, isVideo } = require("../utils/fileUtil");

const add = asyncHandler(async (req, res) => {
  const contentId = req?.body?.content._id;
  const content = await Content.findById(contentId);
  if (content) {
    const savedSection = await Section.create({
      ordinalNumber: req?.body?.ordinalNumber,
      name: req?.body?.name,
      lectures: req?.body?.lectures,
      totalDurationVideoLectures: req?.body?.totalDurationVideoLectures,
      content: req?.body?.content._id,
    });
    await Content.findByIdAndUpdate(
      contentId,
      {
        $push: { sections: savedSection._id },
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(savedSection);
    res.json(response);
  } else {
    throw new ResourceNotFoundException("Data doesn't exists");
  }
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSection = await Section.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        ordinalNumber: req?.body?.ordinalNumber,
        lectures: req?.body?.lectures,
        updated: new Date().getTime(),
      },
      {
        new: true,
      }
    );

    const updatedNewSection = await Section.findByIdAndUpdate(
      id,
      {
        totalDurationVideoLectures: updatedSection.lectures.reduce(
          (total, lecture) => total + lecture.videoDuration,
          0
        ),
      },
      {
        new: true,
      }
    );

    const response = ResponseMapper.toDataResponseSuccess(updatedNewSection);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const getById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const savedSection = await Section.findById(id);
  if (savedSection) {
    const response = ResponseMapper.toDataResponseSuccess(savedSection);
    res.json(response);
  } else {
    throw new ResourceNotFoundException("Data doesn't exists");
  }
});

const uploadFileSection = asyncHandler(async (req, res) => {
  const files = req.files;
  const listPath = [];
  const listError = [];
  let idx = 0;

  for (let file of files) {
    try {
      if (isDocument(file)) {
        const path = await uploadFile(PATH_COURSE_DOCUMENT, file);
        await unlinkFile(file.path);
        listPath.push(path);
      } else if (isVideo(file)) {
        console.log(file.ordinalName);
        const path = await uploadFile(PATH_COURSE_LECTURE, file);
        await unlinkFile(file.path);
        listPath.push(path);
      } else {
        listError.push(idx);
      }
    } catch (error) {
      console.log("Error: " + error);
      listError.push(idx);
    } finally {
      idx++;
    }
  }
  if (listError.length > 0) {
    const response = ResponseMapper.toDataResponse(
      listError,
      StatusCode.DATA_NOT_MAP,
      StatusMessage.DATA_NOT_MAP
    );
    res.json(response);
  } else {
    const response = ResponseMapper.toDataResponseSuccess(listPath);
    res.json(response);
  }
});

const loadFile = asyncHandler(async (req, res) => {
  const filePath = req.query.path;
  const readStream = await getFileStream(filePath);
  readStream.pipe(res);
});

module.exports = { add, update, uploadFileSection, loadFile, getById };
