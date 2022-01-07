const Middleware = require("../../framework/middleware/middleware");
const { wrongCredentials } = require("../errors/auth");
const { fieldsValidator } = require("../utils")

const auth = fieldsValidator([
    "nick", 
    "pass",
], "body");

const validCredentials = async (req, res, next) => {
    const user = await userController.find(req.body.nick);

    if (!user || !checkHash(req.body.pass, user.pass)) {
        return wrongCredentials(res);
    }

    next(req, res);
}

module.exports = {
    auth,
    validCredentials,
}
