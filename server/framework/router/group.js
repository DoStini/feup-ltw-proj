const RouterComponent = require('./routerComponent.js')

/**
 * @class
 * @augments RouterComponent
 */
class RouterGroup extends RouterComponent {
    /** @property {Array.<Router>} */
    #routerComponents = [];
    /** @property {string} prefix */
    #prefix;

    constructor(prefix) {
        super();
        this.#prefix = prefix ?? '';
    }

    /**
     * Adds a router.
     * 
     * @param {RouterComponent
     */
    addRouter (router) {
        this.#routerComponents.push(router);
    }

    /** @inheritdoc */
    handle(path, method) {
        if(!path.startsWith(this.#prefix)) {
            return null;
        }
        path = path.replace(this.#prefix, "");

        let handler;

        for (const router of this.#routerComponents) {
            const callback = router.handle(path, method);
            if (callback) {
                handler = callback;
                break;
            }
        }
    
        return handler;
    }
}

module.exports = RouterGroup;