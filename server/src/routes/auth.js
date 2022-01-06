const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { userRequired, passRequired } = require("../middleware/auth");
const { requestError, checkHash } = require("../utils");

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
module.exports = async (router, userController) => {
    router.post("/register",
        bodyParser,
        userRequired,
        passRequired,
        async (req, res) => {
            const user = await userController.find(req.body.nick);

            if (user == null) {
                await userController.create(req.body.nick, req.body.pass)

                return res.status(200).json({})
            }

            if (!checkHash(req.body.pass, user.pass)) {
                return requestError(res, 401, "User registered with a different password");
            }

            return res.status(200).json({})
        }
    );
}
