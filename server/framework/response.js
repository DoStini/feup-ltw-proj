const http = require("http");

class FrameworkResponse extends http.ServerResponse {
    status(code) {
        this.statusCode = code;
        return this;
    }

    json(body) {
        const response = JSON.stringify(body);
        this.setHeader('Content-Type', 'application/json');
        this.end(response);
    }

    text(body) {
        this.setHeader('Content-Type', 'text/plain; charset=utf-8');
        this.end(body);
    }
}


module.exports = FrameworkResponse;
