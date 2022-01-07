const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const UserController = require("../services/user");
const auth = require("./auth");
const sanity = require("./sanity");
const ranking = require("./ranking");
const game = require("./game");
const DatabaseInterface = require("../database/DatabaseInterface");

/**
 * @param {Framework} app 
 * @param {DatabaseInterface} db
 */
module.exports = (app, db) => {
    const router = new Router();
    const userController = new UserController(db.getModel("user"));

    sanity(router);
    auth(router, userController);
    ranking(router, userController);
    game(router, userController);

    app.addRouter(router);
}
