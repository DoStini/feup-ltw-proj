const config = require("./src/env");
const Framework = require("./framework/framework");
const Router = require("./framework/router/router");
const RouterGroup = require("./framework/router/group");


const router = new Router();

router.get("/thing", (req, res) => {
    return res.status(200).json({
        res: `Cool thing`
    });
});

const router2 = new RouterGroup("/test");
const subRouter = new RouterGroup("/example");

const asdrouter2 = new Router();

asdrouter2.get("/asd", (req, res) => {
    return res.status(200).json({
        res: `Cool asd`
    });
});


const asdrouter3 = new Router();

asdrouter3.get("/asd", (req, res) => {
    return res.status(200).json({
        res: `Cool sadf`
    });
});

router2.addRouter(asdrouter2);
subRouter.addRouter(asdrouter3);

const app = new Framework();
app.addRouter(router);
app.addRouter(router2);

app.listen(config.PORT, () => {
    console.log(`App listening at ${config.PORT}`);

});
