const Middleware = require("../../framework/middleware/middleware");
const GameController = require("../services/gameController");
const { fieldsValidator, requestError } = require("../utils");

const join = fieldsValidator([
    "nick",
    "pass",
    "size",
    "initial",
], "body");

const leave = fieldsValidator([
    "nick",
    "pass",
    "game",
], "body");

const notify = fieldsValidator([
    "nick",
    "pass",
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
    if (!await gameController.playerInGame(req[location].nick)) {
        return requestError(res, 400, "User not in game");
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
    if (await gameController.playerInGame(req[location].nick)) {
        return requestError(res, 400, "User already in game");
    }

    next(req, res);
}

module.exports = {
    join,
    leave,
    notify,
    update,
    userInGame,
    userNotInGame,
}
