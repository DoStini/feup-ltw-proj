const RouterComponent = require('./routerComponent');
const Route = require('../middleware/route');
const Middleware = require('../middleware/middleware');
const RequestHandler = require('../middleware/requestHandler');

class Router extends RouterComponent {
    /** @type {Map.<string, RequestHandler>} */
    #routes = new Map();

    constructor () {
        super();
    }

    #parseRoute(obj) {
        return JSON.stringify(obj);
    }

    /**
     * 
     * @param  {Array.<Middleware.MiddlewareCallback>} callbacks 
     */
    setMiddleware(...callbacks) {
        this.middlewares = callbacks.concat(this.middlewares);

        let callbackCopy = callbacks.splice();
        for(let [key, route] of this.#routes.entries()) {
            callbackCopy.push(route.run);
            this.#routes.set(key, this.#setupMiddleware(callbackCopy));
            callbackCopy.pop();
        }
    }

    /**
     * Creates middleware decorators for the callbacks given
     * 
     * @param {Array.<Middleware.MiddlewareCallback>} callbacks 
     * @returns {RequestHandler}
     */
    #setupMiddleware(callbacks) {
        /** @type {RequestHandler} */
        let totalCallbacks = this.middlewares.concat(callbacks);
        let route = new Route(totalCallbacks[totalCallbacks.length - 1]);

        let next = totalCallbacks[totalCallbacks.length - 1];
        for (let i = totalCallbacks.length - 2; i >= 0; i--) {
            const handler = totalCallbacks[i];

            route = new Middleware(next, handler);
            next = route.run;
        }

        return route;
    }

    /**
     * Registers a GET handler
     * 
     * @param {string} path
     * @param {Array.<Middleware.MiddlewareCallback>} callbacks
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
     * @param {Array.<Middleware.MiddlewareCallback>} callbacks
     */
    post(path, ...callbacks) {
        this.#routes.set(this.#parseRoute({
            method: "POST",
            path,
        }), this.#setupMiddleware(callbacks));
    }

    find(path, method) {
        return this.#routes.get(
            this.#parseRoute({
                method,
                path
            }
        ))?.run;
   }
}

module.exports = Router;