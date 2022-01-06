const Database = require("../database/Database");
const JsonModel = require("../database/JsonModel");

/**
 * 
 * @param {Framework} app
 */
module.exports = async () => {
    const database = new Database();

    const auth = new JsonModel("user");
    database.addModel(auth);

    return database;
}
