const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const UserController = require("../services/user");
const auth = require("./auth");
const sanity = require("./sanity");
const ranking = require("./ranking");
const game = require("./game");
const DatabaseInterface = require("../database/DatabaseInterface");
const GameController = require("../services/gameController");

/**
 * @param {Framework} app 
 * @param {DatabaseInterface} db
 */
module.exports = (app, db) => {
    const router = new Router();
    const userController = new UserController(db.getModel("user"));
    const gameController = new GameController(db.getModel("game"));

    // gameController.setupMultiplayerGame(2,2,"nuno","nuno","nuno2","abc");

    sanity(router);
    auth(router, userController);
    ranking(router, userController);
    game(router, userController, gameController);

    app.addRouter(router);
}
