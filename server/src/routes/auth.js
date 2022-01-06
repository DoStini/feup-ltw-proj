const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");
const { userRequired, passRequired } = require("../middleware/auth");
const UserController = require('../services/user');
const { requestError, checkHash } = require("../utils");

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
module.exports = (router, userController) => {
    router.post("/register",
        bodyParser,
        userRequired,
        passRequired,
        async (req, res) => {
            const user = await userController.find(req.body.nick);

            if (user == null) {
                userController.create(req.body.nick, req.body.pass)

                return res.json({})
            }

            if (!checkHash(req.body.pass, user.pass)) {
                return requestError(res, 401, "User registered with a different password");
            }

            return res.json({})
        }
    );
}
