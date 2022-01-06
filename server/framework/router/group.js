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
    addRouter (router) {
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
}

module.exports = RouterGroup;