const Framework = require("./framework");
const Router = require("./router/router");
const RouterGroup = require("./router/group");

const routerGroup = new RouterGroup("/test");
const subRouter = new RouterGroup("/example");

const router = new Router();

router.get("/thing",
    (req, res, next) => {
        if (true) {
            return next(req, res);
        } else {
            console.log("error")
            return res.status(400).json({
                res: `Error 1`
            })
        }
    },
    (req, res, next) => {
        if (true) {
            return next(req, res);
        } else {
            return res.status(400).json({
                res: `Error 2`
            })
        }
    },
    (req, res) => {
        return res.status(200).json({
            res: `Cool thing`
    });
});

router.get("/other-thing", (req, res) => {
    return res.status(200).text("This is a text thing");
})

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
routerGroup.addRouter(subRouter);

const app = new Framework();
app.addRouter(router);
app.addRouter(routerGroup);

app.listen(8080, () => {
    console.log(`App listening at ${8080}`);
});
