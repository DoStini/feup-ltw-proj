const http = require('http');

const server = http.createServer(function (request, response) {
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

server.listen(8008);
