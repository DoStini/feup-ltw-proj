const FrameworkRequest = require("../request");
const FrameworkResponse = require("../response");
const RequestHandler = require("./requestHandler");

class Middleware extends RequestHandler {

    /**
     * 
     * @param {RequestHandler.requestCallback} next 
     * @param {middlewareCallback} handle 
     */
    constructor(next, handle) {
        super((req, res) => handle(req, res, next));
    }
}

/**
 * This callback handles an HTTP request as a middleware
 * @callback middlewareCallback
 * @param {FrameworkRequest} request
 * @param {FrameworkResponse} response
 * @param {RequestHandler.requestCallback} next
 */

module.exports = Middleware;
