const { hash } = require("../utils");
const DatabaseModel = require("../database/DatabaseModel");

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

    create(user, password) {
        const hashed = hash(password);

        this.#model.insert(user, {
            nick: user,
            pass: hashed,
        });
    }

    find(user) {
        return this.#model.find(user);
    }

}

module.exports = UserController; 