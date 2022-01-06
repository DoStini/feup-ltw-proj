const RequestHandler = require("./requestHandler");

class Route extends RequestHandler {
    /**
     * 
     * @param {RequestHandler.RequestCallback} run 
     */
    constructor(run) {
        super(run);
    }
}

module.exports = Route;
