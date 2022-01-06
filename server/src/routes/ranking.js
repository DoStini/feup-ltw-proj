const Router = require("../../framework/router/router");
const UserController = require('../services/user');

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
 module.exports = (router, userController) => {
    router.post("/ranking", async (request, response) => {
        return response.status(200).json(await userController.getRanking(10));
    });
}