const Framework = require("../../framework/framework");
const Router = require("../../framework/router/router");
const auth = require("./auth");
const sanity = require("./sanity");

/**
 * @param {Framework} app 
 */
module.exports = (app, db) => {
    const router = new Router();

    sanity(router);
    auth(router, db);

    app.addRouter(router);
}
