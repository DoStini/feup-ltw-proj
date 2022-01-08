const Middleware = require("../../framework/middleware/middleware");
const { wrongCredentials, notExists } = require("../errors/auth");
const { fieldsValidator, checkHash } = require("../utils")

const auth = fieldsValidator([
    "nick", 
    "password",
], "body");

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
}
