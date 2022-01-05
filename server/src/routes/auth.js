const bcrypt = require('bcrypt');
const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");
const { userRequired, passRequired } = require("../middleware/auth");
const { requestError } = require("../utils");

/**
 * 
 * @param {Router} router 
 * @param {Database} database 
 */
module.exports = (router, database) => {
    const databaseName = "user";

    router.post("/register",
        bodyParser,
        userRequired,
        passRequired,
        async (req, res) => {
            const user = await database.getModel(databaseName).find(req.body.nick);
            const password = req.body.pass;

            if (user == null) {
                const newPassword = await bcrypt.hash(password, 12)
                await database.getModel(databaseName).insert(req.body.nick, {
                    nick: req.body.nick,
                    pass: newPassword,
                });

                return res.json({})
            }

            if (!await bcrypt.compare(password, user.pass)) {
                return requestError(res, 401, "User registered with a different password");
            }

            return res.json({})
        }
    );
}
