class Router {

    #routes = new Map();

    constructor (notFoundHandler) {
        this.notFoundHandler = notFoundHandler;
    }

    parseRoute(obj) {
        return JSON.stringify(obj);
    }

    get(path, callback) {
        console.log(path);
        this.#routes.set(this.parseRoute({
            method: "GET",
            path,
        }), callback);
        console.log(this.#routes);

    }

    post() {
        this.#routes.set(this.parseRoute({
            method: "POST",
            path,
        }), callback);
    }

    handle(path, method) {
        const callback = this.#routes.get(
            this.parseRoute({
                method,
                path
            }
        ));

        if (!callback) {
            return this.notFoundHandler;
        }

        return callback;
    }
}

module.exports = Router;