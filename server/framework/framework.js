const http = require('http');

class Framework {

    #router;

    constructor (router) {
        this.#router = router;
    }

    listen(port, callback) {
        const server = http.createServer((request, response) => {
            this.#router.handle(request.url, request.method)(request, response);
        });

        callback && callback();
        server.listen(port);
    }
}

module.exports = Framework;
