const Middleware = require("../../framework/middleware/middleware");
const { wrongCredentials, notExists } = require("../errors/auth");
const { fieldsValidator, checkHash, requestError } = require("../utils")

const auth = fieldsValidator([
    "nick", 
    "password",
], "body");

const validNick = (location) => (req, res, next) => {
    const re = new RegExp("[A-Za-z\_.0-9]{3,30}");

    if (re.exec(req[location].nick)?.length !== 1) {
        return requestError(res, 400, "Nick can only contain letters, numbers, '.' and '_' and must be between 3 and 30 characters");
    }

    return next(req, res);
}

const validCredentials = (userController) => async (req, res, next) => {
    const user = await userController.find(req.body.nick);

    if (!user) {
        return notExists(res);
    }

    if (!checkHash(req.body.password, user.password)) {
        return wrongCredentials(res);
    }

    next(req, res);
}

module.exports = {
    auth,
    validCredentials,
    validNick,
}
