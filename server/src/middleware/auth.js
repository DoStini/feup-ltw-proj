const { requestError } = require("../utils")


const userRequired = (req, res, next) => {
    if (!req?.body?.nick) {
        return requestError(res, 400, "nick field is required");
    }

    return next(req, res);
}

const passRequired = (req, res, next) => {
    if (!req?.body?.pass) {
        return requestError(res, 400, "pass field is required");
    }
    
    return next(req, res);
}


module.exports = {
    userRequired,
    passRequired,
}
