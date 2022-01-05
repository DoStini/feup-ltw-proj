const FrameworkRequest = require("./request");
const FrameworkResponse = require("./response");
const Middleware = require("./router/middleware");


/**
 * 
 * @param {FrameworkRequest} request 
 * @param {FrameworkResponse} response 
 * @param {Middleware} next
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
                return next(request, response);
            } catch(err) {
                console.err(err);
                return response.status(500).text("Invalid json data");  
            }
        })
        .on('error', (err) => {
            console.err(err.message); 
            return response.status(500).text("Unexpected error");
        });
}

module.exports = bodyParser;
