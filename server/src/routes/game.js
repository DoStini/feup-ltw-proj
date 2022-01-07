const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { userRequired, passRequired, auth, validCredentials } = require("../middleware/auth");
const { requestError, checkHash } = require("../utils");
const { join, leave, notify, update, userInGame, userNotInGame } = require("../middleware/game");
const queryParser = require("../../framework/middleware/queryParser");
const GameController = require("../services/gameController");

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 * @param {GameController} gameController
 */
module.exports = async (router, userController, gameController) => {

    router.post("/join",
        bodyParser,
        join,
        validCredentials(userController),
        userNotInGame("body", gameController),
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
        userInGame("body", gameController),
        async (req, res) => {
            return res.json({
                "message": "Success",
            });
        }
    );

    router.post("/notify",
        bodyParser,
        notify,
        validCredentials(userController),
        userInGame("body"),
        async (req, res) => {
            return res.json({
                "message": "Succes",
            });
        }
    );

    router.get("/update",
        queryParser,
        update,
        userInGame("query"),
        async (req, res) => {
            res.setupServerSentEvent();
            const gameHandler = (data) => res.write(data);
            return res.json({
                "message": "Succes",
            });
        }
    );
}
