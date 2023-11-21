const createError = require("createerror");

class DataAlreadyExistException extends Error {
  constructor(message) {
    super(message);
    this.name = "DataAlreadyExistException";
  }
}

class DataNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "DataNotFoundException";
  }
}

class ResourceNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceNotFoundException";
  }
}

class NotPermissionException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotPermissionException";
  }
}

module.exports = {
  DataAlreadyExistException,
  DataNotFoundException,
  ResourceNotFoundException,
  NotPermissionException,
};
