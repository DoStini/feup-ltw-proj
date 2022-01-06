const RouterComponent = require('./routerComponent');
const Route = require('./route');
const Middleware = require('./middleware');
const RequestHandler = require('./requestHandler');

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
     * Creates middleware decorators for the callbacks given
     * 
     * @param {Array.<Middleware.MiddlewareCallback>} callbacks 
     * @returns {RequestHandler}
     */
    #setupMiddleware(callbacks) {
        /** @type {RequestHandler} */
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