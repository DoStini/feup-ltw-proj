const Router = require("../../framework/router/router");

/**
 * @param {Router} app 
 */
module.exports = (router) => {
    router.get("/", (req, res) => {
        res.json({
            online: true,
        })
    });
}
