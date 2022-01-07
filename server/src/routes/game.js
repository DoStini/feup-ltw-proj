const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { userRequired, passRequired, auth, validCredentials } = require("../middleware/auth");
const { requestError, checkHash } = require("../utils");
const { join, leave, notify, update } = require("../middleware/game");

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
module.exports = async (router, userController) => {

    router.post("/join",
        bodyParser,
        join,
        validCredentials(userController),
        async (req, res) => {
            return res.json({
                "message": "Succes",
            });
        }
    );

    router.post("/leave",
        bodyParser,
        leave,
        validCredentials(userController),
        async (req, res) => {
            return res.json({
                "message": "Succes",
            });
        }
    );

    router.post("/notify",
        bodyParser,
        notify,
        validCredentials(userController),
        async (req, res) => {
            return res.json({
                "message": "Succes",
            });
        }
    );

    router.get("/update",
        update,
        validCredentials(userController),
        async (req, res) => {
            return res.json({
                "message": "Succes",
            });
        }
    );
}
