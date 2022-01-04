const http = require('http');
const FrameworkResponse = require('./response');
const Router = require('./router');

class Framework {

    #routers = [];
    #notFoundHandler = (req, res) => res.status(404).text(`Cannot ${req.method} ${req.url}\n`);

    constructor ({
        notFoundHandler
    } = {}) {
        if(notFoundHandler != null) this.#notFoundHandler = notFoundHandler;
    }



    /**
     * Adds a router.
     * 
     * @param {Router} router 
     */
    addRouter (router) {
        this.#routers.push(router);
    }

    /**
     * Starts the server and 
     * 
     * @param {number} port The port the server is listening
     * @param {Function} callback The callback that is executed after starting the app
     */ 
    listen(port, callback) {
        const server = http.createServer({ServerResponse: FrameworkResponse}, (request, response) => {
            let handler;

            for (const router of this.#routers) {
                console.log(router)
                const callback = router.handle(request.url, request.method);
                if (callback) {
                    handler = callback;
                    break;
                }
            }

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
