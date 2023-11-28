const User = require("../model/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { ResponseMapper } = require("../../common/response/ResponseMapper");
const validateId = require("../../common/utils/validateId");
const {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
} = require("../../common/error/throwExceptionHandler");


const add = asyncHandler(async (req, res) => {

})

const getAll = asyncHandler(async (req, res) => {

})

const getById = asyncHandler(async (req, res) => {

})

module.exports = {add, getAll, getById}