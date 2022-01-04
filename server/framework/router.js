const http = require("http");
const FrameworkResponse = require('./response.js')

class Router {
    #routes = new Map();

    constructor () {
    }

    parseRoute(obj) {
        return JSON.stringify(obj);
    }

    /**
     * Registers a GET handler
     * 
     * @param {string} path
     * @param {requestCallback} callback
     */
    get(path, callback) {
        this.#routes.set(this.parseRoute({
            method: "GET",
            path,
        }), callback);
        console.log(this.#routes);

    }
    
    /**
     * Registers a POST handler
     * 
     * @param {string} path
     * @param {requestCallback} callback
     */
    post(path, callback) {
        this.#routes.set(this.parseRoute({
            method: "POST",
            path,
        }), callback);
    }

    /**
     * Retrives the callback associated to a request
     * 
     * @param {string} path
     * @param {string} method
     */
    handle(path, method) {
        return this.#routes.get(
            this.parseRoute({
                method,
                path
            }
        ));
    }
}

/**
 * This callback handles an HTTP request
 * @callback requestCallback
 * @param {http.IncomingMessage} request
 * @param {FrameworkResponse} response
 */

module.exports = Router;