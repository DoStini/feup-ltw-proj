const DatabaseModel = require("./DatabaseModel");

class UserController  {
    /** @property {DatabaseModel} model */
    #model;

    /**
     * 
     * @param {DatabaseModel} model 
     */
    constructor(model) {
        this.#model = model;
    }

    async addGame(nick) {
        const user = await this.#model.find(nick);

        if(user["games"] != null) {
            user["games"] = user["games"] + 1;
        } else {
            user["games"] = 1;
        }

        return await this.#model.update(nick, user);
    }

    async addWin(nick) {
        const user = await this.#model.find(nick);

        if(user["wins"] != null) {
            user["wins"] = user["wins"] + 1;
        } else {
            user["wins"] = 1;
        }

        if(user["games"] != null) {
            user["games"] = user["games"] + 1;
        } else {
            user["games"] = 1;
        }

        return await this.#model.update(nick, user);
    }
}

module.exports = UserController;