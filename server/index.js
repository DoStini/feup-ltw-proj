const config = require("./src/env");
const Framework = require("./framework/framework");
const Router = require("./framework/router");


const router = new Router();

router.get("/thing", (req, res) => {
    return res.status(200).json({
        res: `Cool thing`
    });
});

const router2 = new Router();
router.get("/asd", (req, res) => {
    return res.status(200).json({
        res: `Cool asd`
    });
});

const app = new Framework();
app.addRouter(router);
app.addRouter(router2);

app.listen(config.PORT, () => {
    console.log(`App listening at ${config.PORT}`);

});
