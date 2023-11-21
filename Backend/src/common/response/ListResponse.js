class ListResponse {
    constructor(timestamp, statusCode, statusMessage, totalRecords, totalPages, data) {
        this.timestamp = timestamp;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.totalRecords = totalRecords;
        this.totalPages = totalPages;
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

    get _totalRecords() {
        return this.totalRecords;
    }
    set _totalRecords(value) {
        this.totalRecords = value;
    }

    get _totalPages() {
        return this.totalPages;
    }
    set _statusCodetotalPages(value) {
        this.totalPages = value;
    }

    get data() {
        return this.data;
    }
    set data(value) {
        this.data = value;
    }
}

module.exports = {ListResponse}