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

        if(user["victories"] != null) {
            user["victories"] = user["victories"] + 1;
        } else {
            user["victories"] = 1;
        }

        if(user["games"] != null) {
            user["games"] = user["games"] + 1;
        } else {
            user["games"] = 1;
        }

        return await this.#model.update(nick, user);
    }

    async getRanking(size) {
        const data = await this.#model.all();
        const ranking = [];

        let i = 0;
        for(let key in data) {
            if (i >= size) break;
            i++;

            ranking.push({
                nick: data[key].nick,
                victories: data[key].victories ?? 0,
                games: data[key].victories ?? 0
            })
        }

        return {ranking: ranking.sort( (left, right) => {
            return right.victories - left.victories;
        })};
    }
}

module.exports = UserController;