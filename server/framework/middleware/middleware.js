const FrameworkRequest = require("../request");
const FrameworkResponse = require("../response");
const RequestHandler = require("./requestHandler");

class Middleware extends RequestHandler {

    /**
     * 
     * @param {RequestHandler.RequestCallback} next 
     * @param {MiddlewareCallback} handle 
     */
    constructor(next, handle) {
        super((req, res) => handle(req, res, next));
    }
}

/**
 * This callback handles an HTTP request as a middleware
 * @callback MiddlewareCallback
 * @param {FrameworkRequest} request
 * @param {FrameworkResponse} response
 * @param {RequestHandler.RequestCallback} next
 * 
 * @returns {void}
 */

module.exports = Middleware;
