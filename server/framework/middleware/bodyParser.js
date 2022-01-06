const Middleware = require("./middleware");

/**
 * Middleware that handles streaming a POST request JSON body
 * 
 * @type {Middleware.MiddlewareCallback}
 */
function bodyParser(request, response, next) {
    let json = "";
    let body;

    request
        .on('data', (chunk) => {
            json += chunk;  
        })
        .on('end', () => {
            try {
                body = JSON.parse(json);
                request.body = body;
                next(request, response);
            } catch(err) {
                console.error(err);
                response.status(500).text("Invalid json data");  
            }
        })
        .on('error', (err) => {
            console.error(err.message); 
            response.status(500).text("Unexpected error");
        });
}

module.exports = bodyParser;
