const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");
const { userRequired, passRequired } = require("../middleware/auth");

/**
 * @param {Router} app 
 */
module.exports = (router) => {
    router.post("/register", 
        bodyParser,
        userRequired,
        passRequired,
        (req, res) => {
            res.json({
                body: req.body,
            })
        }
    );
}
