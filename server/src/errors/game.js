const { requestError } = require("../utils")

const joinRequired = (res, fields) => requestError(res, 400, "Fields required", {
    fields
});

module.exports = {
    wrongCredentials,
}