class DataResponse {
  constructor(timestamp, statusCode, statusMessage, data) {
    this.timestamp = timestamp;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.data = data;
  }

  get _timestamp() {
    return this.timestamp;
  }

  set _timestamp(value) {
    this.timestamp = value;
  }

  get _statusCode() {
    return this.statusCode;
  }

  set _statusCode(value) {
    this.statusCode = value;
  }

  get _statusMessage() {
    return this.statusMessage;
  }

  set _statusMessage(value) {
    this.statusMessage = value;
  }

  get _data() {
    return this._data;
  }
  set _data(value) {
    this.data = value;
  }
}

module.exports = {DataResponse}