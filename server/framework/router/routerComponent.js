const RequestHandler = require("../middleware/requestHandler");

class RouterComponent {
    /**
     * Retrives the callback associated to a request
     * 
     * @param {string} path
     * @param {string} method
     * 
     * @returns {RequestHandler.RequestCallback}
     */
    find(path, method) {
    };
}

module.exports = RouterComponent;
