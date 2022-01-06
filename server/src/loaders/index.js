const Framework = require("../../framework/framework");
const routes = require("../routes");
const UserController = require("../services/user");
const database = require("./database");

/**
 * 
 * @param {Framework} app 
 */
module.exports = async (app) => {
    const db = await database();

    routes(app, db);
}
