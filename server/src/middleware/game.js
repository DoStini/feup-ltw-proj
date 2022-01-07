const Middleware = require("../../framework/middleware/middleware");
const { requestError } = require("../utils")



const join = (req, res, next) => {


    

    next(req, res);
}

module.exports = {
    userRequired,
    passRequired,
    validCredentials,
}
