const http = require('http');
const FrameworkRequest = require('./request');
const FrameworkResponse = require('./response');
const RouterGroup = require('./router/group');
const RequestHandler = require('./middleware/requestHandler');
const RouterComponent = require('./router/routerComponent');

class Framework {
    /** @type {RequestHandler.RequestCallback} */
    #notFoundHandler = (req, res) => res.status(404).text(`Cannot ${req.method} ${req.url}\n`);
    /** @type {RouterGroup} */
    #router = new RouterGroup();

    /**
     * 
     * @param {Object} [param0] 
     * @param {RequestHandler.RequestCallback} [param0.notFoundHandler]
     */
    constructor ({
        notFoundHandler = this.#notFoundHandler
    } = {}) {
        this.#notFoundHandler = notFoundHandler;
    }

    /**
     * 
     * @param {RouterComponent} router 
     */
    addRouter(router) {
        this.#router.addRouter(router);    
    }

    /**
     * Starts the server and runs the callback.
     * 
     * @param {number} port The port the server is listening
     * @param {Function} callback The callback that is executed after starting the app
     */ 
    listen(port, callback) {
        const server = http.createServer({ServerResponse: FrameworkResponse, IncomingMessage: FrameworkRequest}, 
            (/** @type {FrameworkRequest} */ request, /** @type {FrameworkResponse} */ response) => {
                const handler = this.#router.find(request.url, request.method);

                if (handler != null) {
                    handler(request, response);
                } else {
                    this.#notFoundHandler(request, response);
                }
            }
        );

        callback && callback();
        server.listen(port);
    }
}

module.exports = Framework;
