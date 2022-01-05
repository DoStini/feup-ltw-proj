const bodyParser = require("../../framework/bodyParser");
const Router = require("../../framework/router/router");
const { userRequired, passRequired } = require("../middleware/auth");

/**
 * 
 * @param {Router} router 
 * @param {Database} database 
 */
module.exports = (router, database) => {
    const databaseName = "auth";

    router.post("/register",
        bodyParser,
        userRequired,
        passRequired,
        async (req, res) => {
            const password = await database.getModel(databaseName).find(req.body.nick);

            console.log(password);

            res.json({
                body: req.body,
            })
        }
    );
}
