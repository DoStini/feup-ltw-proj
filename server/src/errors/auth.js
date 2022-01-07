const { requestError } = require("../utils")

const wrongCredentials = (res) => requestError(res, 401, "User registered with a different password");

module.exports = {
    wrongCredentials,
}