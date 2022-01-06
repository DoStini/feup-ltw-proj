const Framework = require("../../framework/framework");
const UserHelper = require("../database/userController");
const routes = require("../routes");
const database = require("./database");

/**
 * 
 * @param {Framework} app 
 */
module.exports = async (app) => {
    const db = await database();

    routes(app, db);
}
