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

const userInGame = (location, gameController) => (req, res, next) => {
    if (false/*!gameController.has(user)*/) {
        return requestError(res, 400, "User not in game");
    }

    next(req, res);
}

module.exports = {
    join,
    leave,
    notify,
    update,
    userInGame,
}
