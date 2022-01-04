const Framework = require("./framework/framework");
const Router = require("./framework/router/router");
const RouterGroup = require("./framework/router/group");

const routerGroup = new RouterGroup("/test");
const subRouter = new RouterGroup("/example");

const router = new Router();

router.get("/thing", (req, res) => {
    return res.status(200).json({
        res: `Cool thing`
    });
});

const router2 = new Router();

router2.get("/asd", (req, res) => {
    return res.status(200).json({
        res: `Cool asd`
    });
});


const router3 = new Router();

router3.get("/asd", (req, res) => {
    return res.status(200).json({
        res: `Cool sadf`
    });
});

routerGroup.addRouter(router2);
subRouter.addRouter(router3);

const app = new Framework();
app.addRouter(router);
app.addRouter(router2);

app.listen(8080, () => {
    console.log(`App listening at ${8080}`);
});
