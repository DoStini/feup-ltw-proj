const Database = require("../database/DatabaseInterface");
const JsonModel = require("../database/JsonModel");
const SqlDatabase = require("../database/SqlDatabase");
const SqlModel = require("../database/SqlModel");
const env = require("../env");

module.exports = async () => {
    const database = new SqlDatabase(env.DATA_PATH);

    const auth = new SqlModel("user", [
        {name: "nick", type: "TEXT", constraint: "PRIMARY KEY"},
        {name: "pass", type: "TEXT", constraint: ""},
    ], database);
    database.addModel(auth);

    database.setup();

    return database;
}
