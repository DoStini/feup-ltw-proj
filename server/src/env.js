require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    DATA_PATH: process.env.DATA_PATH,
    GAME_TIMEOUT: process.env.GAME_TIMEOUT,
}