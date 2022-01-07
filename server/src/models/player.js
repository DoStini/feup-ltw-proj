'use strict';

class Player {
    /** @property {number} id */
    #id;
    /** @property {string} name */
    #name;
    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }
}

module.exports = Player;