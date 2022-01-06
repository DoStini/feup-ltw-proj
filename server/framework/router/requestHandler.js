class RequestHandler {
    /** @type {requestCallback} */
    run;

    /**
     * 
     * @param {requestCallback} run 
     */
    constructor(run) {
        this.run = run;
    }
}

/**
 * This callback handles an HTTP request
 * @callback requestCallback
 * @param {FrameworkRequest} request
 * @param {FrameworkResponse} response
 */


module.exports = RequestHandler;