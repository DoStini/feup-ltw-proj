const Player = require("./player");

class GameResponse {
    /** @type {number} */
    #status;
    /** @type {Player} */
    #winner;

    constructor(status) {
        this.#status = status;
    }

    get status() {
        return this.#status;
    }

    get winner() {
        return this.#winner;
    }

    set winner(winner) {
        return this.#winner = winner;
    }
}

module.exports = GameResponse;