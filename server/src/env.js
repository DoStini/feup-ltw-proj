require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    DATA_PATH: process.env.DATA_PATH,
    CORS_ALLOW_ORIGIN : process.env.CORS_ALLOW_ORIGIN || '*',
    GAME_TIMEOUT: process.env.GAME_TIMEOUT,
}