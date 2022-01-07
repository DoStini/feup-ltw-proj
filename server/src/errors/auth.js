const { requestError } = require("../utils")

const wrongCredentials = (res) => requestError(res, 401, "User registered with a different password");
const notExists = (res) => requestError(res, 401, "User not registered");

module.exports = {
    wrongCredentials,
    notExists,
}