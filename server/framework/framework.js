const http = require('http');
const FrameworkResponse = require('./response');
const Router = require('./router/router');
const RouterGroup = require('./router/group');
const RouterComponent = require('./router/routerComponent');

class Framework {
    #notFoundHandler = (req, res) => res.status(404).text(`Cannot ${req.method} ${req.url}\n`);
    
    /** @property {RouterGroup} router */
    #router = new RouterGroup();

    constructor ({
        notFoundHandler
    } = {}) {
        if(notFoundHandler != null) this.#notFoundHandler = notFoundHandler;
        // this.root = root;
    }

    /**
     * 
     * @param {RouterComponent} router 
     */
    addRouter(router) {
        this.#router.addRouter(router);    
    }

    /**
     * Starts the server and 
     * 
     * @param {number} port The port the server is listening
     * @param {Function} callback The callback that is executed after starting the app
     */ 
    listen(port, callback) {
        const server = http.createServer({ServerResponse: FrameworkResponse}, (request, response) => {
            const handler = this.#router.handle(request.url, request.method);

            if (handler) {
                handler(request, response);
            } else {
                this.#notFoundHandler(request, response);
            }
        });

        callback && callback();
        server.listen(port);
    }
}

module.exports = Framework;
