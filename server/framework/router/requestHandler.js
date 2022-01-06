class RequestHandler {
    /** @type {RequestCallback} */
    run;

    /**
     * 
     * @param {RequestCallback} run 
     */
    constructor(run) {
        this.run = run;
    }
}

/**
 * This callback handles an HTTP request
 * @callback RequestCallback
 * @param {FrameworkRequest} request
 * @param {FrameworkResponse} response
 * 
 * @returns {void}
 */


module.exports = RequestHandler;