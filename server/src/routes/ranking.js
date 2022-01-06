const Router = require("../../framework/router/router");
const UserController = require('../database/userController');

/**
 * 
 * @param {Router} router 
 * @param {UserController} userController 
 */
 module.exports = (router, userController) => {
    const databaseName = "auth";

    router.post("/ranking", async (request, response) => {
        return response.status(200).json(await userController.getRanking(10));
    });
}