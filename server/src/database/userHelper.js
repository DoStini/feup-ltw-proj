const DatabaseModel = require("./DatabaseModel");

class UserHelper  {
    /** @property {DatabaseModel} model */
    #model;

    /**
     * 
     * @param {DatabaseModel} model 
     */
    constructor(model) {
        this.#model = model;
    }

    async addWin(nick) {
        const user = await this.#model.find(nick);

        if(user["wins"] != null) {
            user["wins"] = user["wins"] + 1;
        } else {
            user["wins"] = 1;
        }

        return await this.#model.update(nick, user);
    }
}

module.exports = UserHelper;