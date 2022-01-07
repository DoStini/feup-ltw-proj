const { fieldsValidator } = require("../utils");

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

module.exports = {
    join,
    leave,
    notify,
    update,
}
