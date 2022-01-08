const Router = require("../../framework/router/router");
const UserController = require('../services/user');
const bodyParser = require("../../framework/middleware/bodyParser");
const { validCredentials, validNick } = require("../middleware/auth");
const { requestError, hash } = require("../utils");
const { join, leave, notify, update, userInGame, userNotInGame, joinAttributes, userInGameHash, gameFull } = require("../middleware/game");
const queryParser = require("../../framework/middleware/queryParser");
const GameController = require("../services/gameController");
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
        validNick("body"),
        validCredentials(userController),
        async (req, res) => {
            let existingGame = await gameController.playerInGame(req.body.nick);
            if (existingGame != null) {
                if( existingGame.player2 !== "null") {
                    return requestError(res, 400, "User already in a game");
                } else {
                    await gameController.endGame(existingGame.hash);
                }
            }

            let foundGame = await gameController.findGame(req.body.size, req.body.initial);
            let gameHash;

            if(foundGame === null) {
                gameHash = hash(req.body.nick + Date.now() + req.body.size + req.body.initial)
                await gameController.setupMultiplayerGame(req.body.size, req.body.initial, req.body.nick, req.body.nick, null, gameHash);
            } else {
                gameHash = foundGame.gameHash;
                await gameController.addPlayer2(foundGame, req.body.nick);
                gameController.registerTimeout(foundGame.player1.name, gameHash);
            }

            return res.json({
                "game" : gameHash,
            });
        }
    );

    router.post("/leave",
        bodyParser,
        leave,
        validNick("body"),
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
        validNick("body"),
        validCredentials(userController),
        userInGameHash("body", gameController),
        gameFull(gameController),
        async (req, res) => {
            const hash = req.body.game;

            const { result, game } = await gameController.clickHole(req.body.nick, hash, req.body.move);

            if (result.status === WRONG_TURN) {
                return requestError(res, 400, "Not your turn to play");
            } 
            
            if (result.status === INVALID_HOLE) {
                return requestError(res, 400, "Invalid hole");
            }

            gameController.cancelTimeout(game.player1.name);
            gameController.cancelTimeout(game.player2.name);
            
            const obj = {
                board: game.parseBoard(),
                pit: req.body.move
            };
            
            if (result.status === GAME_END) {
                obj.winner = result.winner;

                gameController.notifyAll(hash, obj);
                gameController.endGame(hash);
            } else {
                gameController.registerTimeout(game.currentPlayer.name, hash);

                gameController.notifyAll(hash, obj);
            }

            return res.json({});
        }
    );

    router.get("/update",
        queryParser,
        update,
        validNick("query"),
        userInGameHash("query", gameController),
        async (req, res) => {
            res.setupServerSentEvent();
            gameController.registerEvent(req.query.nick, res);
            gameController.startGameNotify(req.query.game);
        }
    );
}
