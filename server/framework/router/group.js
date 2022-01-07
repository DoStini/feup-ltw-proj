const Middleware = require('../middleware/middleware.js');
const RouterComponent = require('./routerComponent.js')

/**
 * @class
 * @augments RouterComponent
 * 
 */
class RouterGroup extends RouterComponent {
    /** @type {Array.<RouterComponent>} */
    #routerComponents = [];
    /** @property {string} prefix */
    #prefix;

    /** @param {string} prefix */
    constructor(prefix) {
        super();
        this.#prefix = prefix ?? '';
    }

    /**
     * Adds a router.
     * 
     * @param {RouterComponent} router
     */
    addRouter(router) {
        router.setMiddleware(...this.middlewares);

        this.#routerComponents.push(router);
    }

    find(path, method) {
        if(!path.startsWith(this.#prefix)) {
            return null;
        }
        path = path.replace(this.#prefix, "");

        let handler;

        for (const router of this.#routerComponents) {
            const callback = router.find(path, method);
            if (callback != null) {
                handler = callback;
                break;
            }
        }
    
        return handler;
    }

    /**
     * @type {Array.<Middleware.MiddlewareCallback>}
     */
    setMiddleware(...callbacks) {
        this.middlewares = callbacks.concat(this.middlewares);

        this.#routerComponents.forEach((routerComponent) => {
            routerComponent.setMiddleware(...callbacks);
        })
    }
}

module.exports = RouterGroup;