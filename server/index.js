const config = require("./src/env");
const Framework = require("./framework/framework");
const Router = require("./framework/router");


const router = new Router((req, res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end(`Cannot ${req.method} ${req.url}\n`);
});

router.get("/thing", (req, res) => {
    console.log("asdasdfasd")
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        res: `Cool thing`
    }));
})

const app = new Framework(router);

app.listen(config.PORT, () => {
    console.log(`App listening at ${config.PORT}`);

});
