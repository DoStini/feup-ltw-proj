const RequestHandler = require("./requestHandler");

class Route extends RequestHandler {
    /**
     * 
     * @param {RequestHandler.requestCallback} run 
     */
    constructor(run) {
        super(run);
    }
}

module.exports = Route;
