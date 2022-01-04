const http = require('http');

class Framework {
    get(path, callback) {

    }

    post(path, callback) {

    }

    listen(port, callback) {
        const server = http.createServer((request, response) => {
            switch (request.url) {
                case "/home":
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end('Olá mundo\n');
                break;
                case "/ok":
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end('ok\n');
                break;
                default:
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end('Not found\n');
            }
        });

        callback && callback();
        server.listen(port);
    }
}

module.exports = Framework;
