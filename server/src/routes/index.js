const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const UserController = require("../services/user");
const auth = require("./auth");
const sanity = require("./sanity");

/**
 * @param {Framework} app 
 * @param {UserController} userController
 */
module.exports = (app, db) => {
    const router = new Router();

    sanity(router);

    const userController = new UserController(db.getModel("user"));
    auth(router, userController);

    app.addRouter(router);
}
