const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { auth } = require("../middleware/auth");
const { checkHash } = require("../utils");
const { wrongCredentials } = require("../errors/auth");

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
module.exports = async (router, userController) => {
    router.post("/register",
        bodyParser,
        auth,
        async (req, res) => {
            const user = await userController.find(req.body.nick);

            if (user == null) {
                await userController.create(req.body.nick, req.body.password)

                return res.status(200).json({})
            }

            if (!checkHash(req.body.password, user.password)) {
                
                return wrongCredentials(res);
            }

            return res.status(200).json({})
        }
    );
}
