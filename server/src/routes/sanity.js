const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");

/**
 * @param {Framework} app 
 */
module.exports = (app) => {
    const router = new Router();

    router.get("/", (req, res) => {
        res.json({
            online: true,
        })
    });

    app.addRouter(router);
}
