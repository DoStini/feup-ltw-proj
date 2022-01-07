const Middleware = require("../../framework/middleware/middleware");
const GameController = require("../services/gameController");
const { fieldsValidator, requestError } = require("../utils");
const { testNumber } = require("./validation");

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
}
