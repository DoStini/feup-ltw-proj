const RequestHandler = require("./requestHandler");

class RouterComponent {
    /**
     * Retrives the callback associated to a request
     * 
     * @param {string} path
     * @param {string} method
     * 
     * @returns {RequestHandler.requestCallback}
     */
    find(path, method) {
    };
}

module.exports = RouterComponent;
