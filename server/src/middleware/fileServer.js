const fs = require('fs');
const RequestHandler = require('../../framework/middleware/requestHandler');

/**
 * @type {RequestHandler.RequestCallback}
 */
module.exports = (req, res) => {
    fs.readFile(`public/${req.url}`, null, function (error, data) {
        if (error) {
            res.status(404).text(`Cannot ${req.method} ${req.url}\n`)
        } else {
            let extension = req.url.slice((req.url.lastIndexOf(".") - 1 >>> 0) + 2);

            if (extension === "js") {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (extension === "css") {
                res.setHeader('Content-Type', 'text/css');
            } else {
                return res.status(404).text(`Cannot ${req.method} ${req.url}\n`)
            }
            res.end(data);
        }
    })
};