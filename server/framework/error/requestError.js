class RequestError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = RequestError;