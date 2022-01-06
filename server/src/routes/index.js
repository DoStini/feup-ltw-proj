const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const UserController = require("../services/user");
const auth = require("./auth");
const sanity = require("./sanity");
const ranking = require("./ranking");
const Database = require("../database/Database");


/**
 * @param {Framework} app 
 * @param {Database} db
 */
module.exports = (app, db) => {
    const router = new Router();
    const userController = new UserController(db.getModel("user"));

    sanity(router);
    auth(router, userController);
    ranking(router, userController);

    app.addRouter(router);
}