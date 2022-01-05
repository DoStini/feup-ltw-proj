const bcrypt = require('bcrypt');
const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");
const Database = require("../database/Database");
const { userRequired, passRequired } = require("../middleware/auth");
const { requestError } = require("../utils");

/**
 * 
 * @param {Router} router 
 * @param {Database} database 
 */
 module.exports = (router, database) => {
    const databaseName = "auth";

    router.post("/ranking", (request, response) => {
        let result = [];

        const rankingModel = database.getModel("ranking");
    });
}