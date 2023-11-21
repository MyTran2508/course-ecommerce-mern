const { StatusCode } = require("../message/StatusCode");
const { StatusMessage } = require("../message/StatusMessage");
const { ResponseMapper } = require("../response/ResponseMapper");
const { DataAlreadyExistException, 
  DataNotFoundException, 
  ResourceNotFoundException, 
  NotPermissionException} = require("./throwExceptionHandler")

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof DataAlreadyExistException) {
    response = ResponseMapper.toDataResponse(err.message, StatusCode.DATA_CONFLICT, StatusMessage.DATA_CONFLICT);
    res.status(200).json(response);
  }
  if (err instanceof DataNotFoundException) {
    response = ResponseMapper.toDataResponse(err.message, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    res.status(200).json(response);
  }
  if (err instanceof ResourceNotFoundException) {
    response = ResponseMapper.toDataResponse(err.message, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    res.status(200).json(response);
  }
  if (err instanceof NotPermissionException) {
    response = ResponseMapper.toDataResponse(err.message, StatusCode.NOT_PERMISSION, StatusMessage.NOT_PERMISSION);
    res.status(200).json(response);
  }

};


module.exports = { errorHandler, notFound };

