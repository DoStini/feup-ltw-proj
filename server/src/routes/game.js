const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { userRequired, passRequired, auth, validCredentials } = require("../middleware/auth");
const { requestError, checkHash, hash } = require("../utils");
const { join, leave, notify, update, userInGame, userNotInGame, joinAttributes, userInGameHash, gameFull } = require("../middleware/game");
const queryParser = require("../../framework/middleware/queryParser");
const GameController = require("../services/gameController");
const { GAME_TIMEOUT } = require("../env");
const { WRONG_TURN, INVALID_HOLE, GAME_END } = require("../constants");

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
                await gameController.setupMultiplayerGame(req.body.size, req.body.initial, req.body.nick, req.body.nick, null, gameHash);
            } else {
                gameHash = foundGame.gameHash;
                await gameController.addPlayer2(foundGame, req.body.nick);

                // send event to player 1
            }

            // setTimeout((gameController, nick, hash) => {
            //     gameController.leaveGame(nick, hash);
            // }, GAME_TIMEOUT, gameController, req.body.nick, gameHash);

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
            await gameController.leaveGame(req.body.nick, req.body.game);

            return res.json({});
        }
    );

    router.post("/notify",
        bodyParser,
        notify,
        validCredentials(userController),
        userInGameHash("body", gameController),
        gameFull(gameController),
        async (req, res) => {

            const { result, game } = await gameController.clickHole(req.body.nick, req.body.game, req.body.move);

            if (result.status === WRONG_TURN) {
                return requestError(res, 400, "Not your turn to play");
            } 
            
            if (result.status === INVALID_HOLE) {
                return requestError(res, 400, "Invalid hole");
            } 
            
            const obj = {
                board: game.parseBoard(),
                pit: req.body.move
            };
            
            if (result.status === GAME_END) {
                obj.winner = result.winner.name;
            }

            gameController.notifyAll(req.body.game, obj);

            return res.json(obj); // This is not obj, jsut leave for debug for now
        }
    );

    router.get("/update",
        queryParser,
        update,
        userInGameHash("query", gameController),
        async (req, res) => {
            res.setupServerSentEvent();
            const handler = res.write;

            gameController.registerEvent(req.body.nick, handler);
            gameController.startGameNotify(req.query.game);
        }
    );
}
