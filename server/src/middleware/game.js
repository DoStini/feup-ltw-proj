const Middleware = require("../../framework/middleware/middleware");
const GameController = require("../services/gameController");
const { fieldsValidator, requestError } = require("../utils");
const { testNumber } = require("./validation");

const join = fieldsValidator([
    "nick",
    "password",
    "size",
    "initial",
], "body");

const leave = fieldsValidator([
    "nick",
    "password",
    "game",
], "body");

const notify = fieldsValidator([
    "nick",
    "password",
    "game",
    "move",
], "body");

const update = fieldsValidator([
    "nick",
    "game",
], "query");

/**
 * 
 * @param {string} location 
 * @param {GameController} gameController 
 * @returns {Middleware.MiddlewareCallback}
 */
const userInGame = (location, gameController) => async (req, res, next) => {
    if (await gameController.playerInGame(req[location].nick) == null) {
        return requestError(res, 400, "User not in a game");
    }

    next(req, res);
}

/**
 * 
 * @param {string} location 
 * @param {GameController} gameController 
 * @returns {Middleware.MiddlewareCallback}
 */
 const userInGameHash = (location, gameController) => async (req, res, next) => {
    const foundGame = await gameController.playerInGame(req[location].nick);
    if (foundGame == null) {
        return requestError(res, 400, "User not in a game");
    }

    if(foundGame.hash !== req[location].game) {
        return requestError(res, 400, `User not in game ${req[location].game}`);
    }

    next(req, res);
}

/**
 * 
 * @param {string} location 
 * @param {GameController} gameController 
 * @returns {Middleware.MiddlewareCallback}
 */
 const gameFull = (gameController) => async (req, res, next) => {
    const players = await gameController.players(req.body.game);
    
    if (players[0] == "null" || players[1] == "null") {
        return requestError(res, 400, "Game not full");
    }

    next(req, res);
}

/**
 * 
 * @param {string} location 
 * @param {GameController} gameController 
 * @returns {Middleware.MiddlewareCallback}
 */
 const userNotInGame = (location, gameController) => async (req, res, next) => {
    if (await gameController.playerInGame(req[location].nick) != null) {
        return requestError(res, 400, "User already in a game");
    }

    next(req, res);
}

/**
 * 
 * @type {Middleware.MiddlewareCallback}
 */
const joinAttributes = (req, res, next) => {
    try {
        testNumber(req, "body", "size", 1);
        testNumber(req, "body", "initial", 1);

        next(req, res);
    } catch (e) {
        requestError(res, e.status, e.message);
    }
}

module.exports = {
    join,
    leave,
    notify,
    update,
    joinAttributes,
    userInGame,
    userNotInGame,
    userInGameHash,
    gameFull,
}
