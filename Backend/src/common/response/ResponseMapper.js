const { DataResponse } = require("./DataResponse");
const { ListResponse } = require("./ListResponse");
const { StatusCode } = require("../message/StatusCode");
const { StatusMessage } = require("../message/StatusMessage");

class ResponseMapper {
  static toDataResponse(data, statusCode, statusMessage) {
    const dataResponse = new DataResponse();
    dataResponse._timestamp = Date.now();
    dataResponse._statusCode = statusCode;
    dataResponse._statusMessage = statusMessage;
    dataResponse._data = data;
    return dataResponse;
  }

  static toListResponse(
    list,
    totalRecords,
    totalPages,
    statusCode,
    statusMessage
  ) {
    const listResponse = new ListResponse();
    listResponse.timestamp = Date.now();
    listResponse.data = list;
    listResponse.totalRecords = totalRecords;
    listResponse.totalPages = totalPages;
    listResponse.statusCode = statusCode;
    listResponse.statusMessage = statusMessage;
    return listResponse;
  }

  static toDataResponseSuccess(data) {
    if (data !== null && data !== undefined) {
      return this.toDataResponse(
        data,
        StatusCode.REQUEST_SUCCESS,
        StatusMessage.REQUEST_SUCCESS
      );
    } else {
      return this.toDataResponse(
        null,
        StatusCode.DATA_NOT_FOUND,
        StatusMessage.DATA_NOT_FOUND
      );
    }
  }
  static toListResponseSuccess(list) {
    if (list && list.length > 0) {
      return this.toListResponse(
        list,
        list.length,
        1,
        StatusCode.REQUEST_SUCCESS,
        StatusMessage.REQUEST_SUCCESS
      );
    } else {
      return this.toListResponse(
        null,
        0,
        0,
        StatusCode.DATA_NOT_FOUND,
        StatusMessage.DATA_NOT_FOUND
      );
    }
  }

  static toPagingResponse(page, statusCode, statusMessage) {
    if (page) {
      const totalRecords = page.totalItems; // Sửa lại tên phương thức
      const totalPages = Math.ceil(totalRecords / page.pageSize); // Sửa lại tính toán totalPages
      const list = page.data; // Sửa lại tên phương thức
      return this.toListResponse(
        list,
        totalRecords,
        totalPages,
        statusCode,
        statusMessage
      );
    }
    return this.toListResponse(
      null,
      0,
      0,
      StatusCode.DATA_NOT_FOUND,
      StatusMessage.DATA_NOT_FOUND
    );
  }

  static toPagingResponseSuccess(page) {
    if (page && page.totalItems > 0) {
      return this.toPagingResponse(
        page,
        StatusCode.REQUEST_SUCCESS,
        StatusMessage.REQUEST_SUCCESS
      );
    }
    return this.toPagingResponse(
      page,
      StatusCode.DATA_NOT_FOUND,
      StatusMessage.DATA_NOT_FOUND
    );
  }
}

module.exports = { ResponseMapper };
