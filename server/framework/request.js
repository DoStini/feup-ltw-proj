const http = require("http");
const RequestError = require("./error/requestError");

class FrameworkRequest extends http.IncomingMessage {
    /** @type {Object} */
    #body;

    get body() {
        if(this.#body == null) {
            throw new RequestError('Body not constructed');
        }

        return this.#body;
    }

    set body(body) {
        this.#body = body;
    }
}


module.exports = FrameworkRequest;
