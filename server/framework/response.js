const http = require("http");

class FrameworkResponse extends http.ServerResponse {
    /**
     * Sets the status code that will be sent to the client when
     * the headers get flushed.
     * 
     * @param {number} code 
     * @returns {FrameworkResponse} Reference to the own object, for chaining functions.
     */
    status(code) {
        this.statusCode = code;
        return this;
    }

    /**
     * Sets the header Content-Type to 'application/json' and sends the JSON body.
     * 
     * @param {*} body 
     */
    json(body) {
        const response = JSON.stringify(body);
        this.setHeader('Content-Type', 'application/json');
        this.end(response);
    }

    /**
     * Sets the header Content-Type to 'text/plain; charset=utf-8' and sends the text.
     * 
     * @param {string} body 
     */
    text(body) {
        this.setHeader('Content-Type', 'text/plain; charset=utf-8');
        this.end(body);
    }

    /**
     * 
     * @param {string} text 
     */
    setupServerSentEvent() {
        this.setHeader('Content-Type', 'text/event-stream');
        this.setHeader('Connection', 'keep-alive');
    }
}


module.exports = FrameworkResponse;
