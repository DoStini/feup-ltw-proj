const Framework = require("../../framework/framework");
const routes = require("../routes");
const database = require("./database");

/**
 * 
 * @param {Framework} app 
 */
module.exports = async (app) => {
    const db = await database();
    console.log("data", db)
    routes(app, db);
}
