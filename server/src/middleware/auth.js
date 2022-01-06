const Middleware = require("../../framework/middleware/middleware");
const { requestError } = require("../utils")

/**
 * Ensures the nick field in a JSON POST body exists
 * 
 * @type {Middleware.MiddlewareCallback}
 */
const userRequired = (req, res, next) => {
    if (!req?.body?.nick) {
        return requestError(res, 400, "nick field is required");
    }

    next(req, res);
}

/**
 * Ensures the pass field in a JSON POST body exists
 * 
 * @type {Middleware.MiddlewareCallback} 
 */
const passRequired = (req, res, next) => {
    if (!req?.body?.pass) {
        return requestError(res, 400, "pass field is required");
    }
    
    next(req, res);
}


module.exports = {
    userRequired,
    passRequired,
}
