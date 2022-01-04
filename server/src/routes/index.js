const Framework = require("../../framework/framework");
const sanity = require("./sanity")

/**
 * 
 * @param {Framework} app 
 */
module.exports = (app) => {
    sanity(app);
}
