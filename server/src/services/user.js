const DatabaseModel = require("../database/DatabaseModel");
const { hash } = require("../utils");

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

    async find(user) {
        return await this.#model.find(user);
    }

    async create(user, password) {
        const hashed = hash(password);

        await this.#model.insert(user, {
            nick: user,
            pass: hashed,
        });
    }

    async addGame(nick) {
        const user = await this.#model.find(nick);

        user["games"] = (user["games"] ?? 0) + 1;

        await this.#model.update(nick, user);
    }

    async addWin(nick) {
        const user = await this.#model.find(nick);

        user["victories"] = (user["victories"] ?? 0) + 1;
        user["games"] = (user["games"] ?? 0) + 1;

        await this.#model.update(nick, user);
    }

    async getRanking(size) {
        const data = await this.#model.all();
        const ranking = [];

        for(let key in data) {
            ranking.push({
                nick: data[key].nick,
                victories: data[key].victories ?? 0,
                games: data[key].games ?? 0
            })
        }

        return {ranking : ranking.sort((left, right) => {
            return right.victories - left.victories;
        }).slice(0, size)};
    }
}

module.exports = UserController; 