const Category = require("../model/categoryModel");
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

const add = asyncHandler(async (req, res) => {
  const name = req?.body?.name;
  const savedCategory = await Category.findOne({ name: name });
  if (!savedCategory) {
    const newCategory = await Category.create(req.body);
    const response = ResponseMapper.toDataResponseSuccess(newCategory);
    return res.json(response);
  } else {
    const response = ResponseMapper.toDataResponse(
      "Data already exist",
      StatusCode.DATA_CONFLICT,
      StatusMessage.DATA_CONFLICT
    );
    return res.json(response);
  }
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        description: req?.body?.description,
        topics: req?.body?.topics,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updatedCategory);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

const getAll = asyncHandler(async (req, res) => {
  try {
    const getCategories = await Category.find();
    console.log(getCategories);
    const response = ResponseMapper.toListResponseSuccess(getCategories);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

const getById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const category = await Category.findById(id);
  if (category) {
    const response = ResponseMapper.toDataResponseSuccess(category);
    res.json(response);
  } else {
    throw new DataNotFoundException(id + " does not exists");
  }
});

const getByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const category = await Category.findOne({ name: name });
  if (category) {
    const response = ResponseMapper.toDataResponseSuccess(category);
    res.json(response);
  } else {
    throw new ResourceNotFoundException(categoryName + " does not exists");
  }
});

const setRemoved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      {
        removed: true,
      },
      {
        new: true,
      }
    );
    const response = ResponseMapper.toDataResponseSuccess(updateCategory);
    res.json(response);
  } catch (error) {
    console.log(error);
    throw new ResourceNotFoundException(id + " does not exists in DB");
  }
});

module.exports = { add, update, getAll, getById, getByName, setRemoved };
