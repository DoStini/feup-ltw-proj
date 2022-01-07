const Middleware = require("../middleware/middleware");
const RequestHandler = require("../middleware/requestHandler");

class RouterComponent {
    /** @type {Array.<Middleware.MiddlewareCallback>} */
    middlewares = [];

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

    /**
     * Sets a list of middlewares for the router
     * 
     * @param  {Array.<Middleware.MiddlewareCallback>} callbacks 
     */
    setMiddleware(...callbacks) {

    }
}

module.exports = RouterComponent;
