const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");
const GameController = require("./src/services/gameController");
const fs = require('fs');

const app = new Framework({notFoundHandler : (req, res) => {
    fs.readFile(`public/${req.url}`, null, function (error, data) {
        if (error) {
            res.status(404).text(`Cannot ${req.method} ${req.url}\n`)
        } else {
            let extension = req.url.slice((req.url.lastIndexOf(".") - 1 >>> 0) + 2);

            if(extension === "js") {
                res.setHeader('Content-Type', 'application/javascript');
            } else if(extension === "css") {
                res.setHeader('Content-Type', 'text/css');
            } else {
                return res.status(404).text(`Cannot ${req.method} ${req.url}\n`)
            }
            res.end(data);
        }
    });
}});
loaders(app);

app.listen(config.PORT, () => {
    console.log(`listening on ${config.PORT}`);
});
