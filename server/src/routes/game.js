const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { userRequired, passRequired, auth, validCredentials } = require("../middleware/auth");
const { requestError, checkHash, hash } = require("../utils");
const { join, leave, notify, update, userInGame, userNotInGame, joinAttributes, userInGameHash } = require("../middleware/game");
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
        joinAttributes,
        validCredentials(userController),
        userNotInGame("body", gameController),
        async (req, res) => {
            let foundGame = await gameController.findGame(req.body.size, req.body.initial);
            let gameHash;

            if(foundGame === null) {
                gameHash = hash(req.body.nick + Date.now() + req.body.size + req.body.initial)
                await gameController.setupMultiplayerGame(req.body.size, req.body.initial, req.body.nick, req.body.nick, gameHash);
            } else {
                gameHash = foundGame.gameHash;
                await gameController.addPlayer2(foundGame, req.body.nick);
            }
            
            // setTimeout(() => {
            //     gameController.
            // })

            return res.json({
                "game" : gameHash,
            });
        }
    );

    router.post("/leave",
        bodyParser,
        leave,
        validCredentials(userController),
        userInGameHash("body", gameController),
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
