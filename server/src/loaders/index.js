const Framework = require("../../framework/framework");
const routes = require("../routes")

/**
 * 
 * @param {Framework} app 
 */
module.exports = (app) => {
    routes(app);
}
