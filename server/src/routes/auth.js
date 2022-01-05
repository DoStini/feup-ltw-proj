const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");

/**
 * @param {Router} app 
 */
module.exports = (router) => {
    router.post("/register", 
        bodyParser,
        (req, res) => {
            res.json({
                body: req.body,
            })
        }
    );
}
