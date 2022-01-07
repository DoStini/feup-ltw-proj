
const Middleware = require("./middleware");

/**
 * Middleware that handles streaming a POST request JSON body
 * 
 * @type {Middleware.MiddlewareCallback}
 */
function queryParser(request, response, next) {
    const search = request.url.split("?");
    let query = {};
    if (search.length > 1) {
        const urlSearchParams = new URLSearchParams(search[1]);
        query = Object.fromEntries(urlSearchParams.entries());        
    }

    request.query = query;

    next(request, response);
}

module.exports = queryParser;
