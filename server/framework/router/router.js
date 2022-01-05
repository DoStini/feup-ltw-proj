const http = require("http");
const RouterComponent = require('./routerComponent');
const Route = require('./route');
const Middleware = require('./middleware');

class Router extends RouterComponent {
    /** @property {Map.<string, Route>} routes */
    #routes = new Map();

    constructor () {
        super();
    }

    #parseRoute(obj) {
        return JSON.stringify(obj);
    }

    #setupMiddleware(callbacks) {
        let route = new Route(callbacks[callbacks.length - 1]);

        let next = route.run;
        for (let i = callbacks.length - 2; i >= 0; i--) {
            const handler = callbacks[i];

            route = new Middleware(next, handler);
            next = route.run;
        }

        return route;
    }

    /**
     * Registers a GET handler
     * 
     * @param {string} path
     * @param {requestCallback} callback
     */
    get(path, ...callbacks) {
        this.#routes.set(this.#parseRoute({
            method: "GET",
            path,
        }), this.#setupMiddleware(callbacks)); 
    }

    /**
     * Registers a POST handler
     * 
     * @param {string} path
     * @param {requestCallback} callback
     */
    post(path, ...callbacks) {
        this.#routes.set(this.#parseRoute({
            method: "POST",
            path,
        }), this.#setupMiddleware(callbacks));
    }

    /**
     * Retrives the callback associated to a request
     * 
     * @param {string} path
     * @param {string} method
     */
    find(path, method) {
        return this.#routes.get(
            this.#parseRoute({
                method,
                path
            }
        ))?.run;
   }
}

/**
 * This callback handles an HTTP request
 * @callback requestCallback
 * @param {http.IncomingMessage} request
 * @param {FrameworkResponse} response
 */

module.exports = Router;