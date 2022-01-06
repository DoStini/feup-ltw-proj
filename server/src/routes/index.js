const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const UserController = require("../database/userController");
const auth = require("./auth");
const sanity = require("./sanity");
const ranking = require("./ranking");


/**
 * @param {Framework} app 
 */
module.exports = (app, db) => {
    const router = new Router();
    const userController = new UserController(db.getModel("user"));

    sanity(router);
    auth(router, db);
    ranking(router, userController);

    app.addRouter(router);
}
