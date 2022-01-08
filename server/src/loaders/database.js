const Database = require("../database/DatabaseInterface");
const JsonModel = require("../database/JsonModel");
const SqlDatabase = require("../database/SqlDatabase");
const SqlModel = require("../database/SqlModel");
const env = require("../env");

module.exports = async () => {
    const database = new SqlDatabase(env.DATA_PATH);

    const auth = new SqlModel("user", [
        {name: "nick", type: "TEXT", constraint: "PRIMARY KEY"},
        {name: "password", type: "TEXT", constraint: ""},
        {name: "games", type: "INTEGER", constraint: "DEFAULT 0"},
        {name: "victories", type: "INTEGER", constraint: "DEFAULT 0"},
    ], database);
    database.addModel(auth);

    const game = new SqlModel("game", [
        {name: "hash", type: "TEXT", constraint: "PRIMARY KEY"},
        {name: "player1", type: "TEXT", constraint : ""},
        {name: "player2", type: "TEXT", constraint: ""},
        {name: "board", type: "TEXT", constraint: ""},
        {name: "turn", type: "TEXT", constraint: ""},
    ], database, true);
    database.addModel(game);

    database.setup();

    return database;
}
