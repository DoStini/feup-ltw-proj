const { WRONG_TURN } = require("../constants");
const Board = require("../models/board");
const GameResponse = require("../models/gameResponse");
const Player = require("../models/player");
const { GameState, EndState, PlayerState } = require("./gameStates");

class Game {
    /** 
     * @property {GameState} state The current game state.
     * @type {GameState} 
     */
    #state;
    /** @property {Board} board The game board */
    #board;
    /** @property {Player} player1 The player with ID 0 */
    #player1;
    /** @property {Player} player2 The player with ID 1 */
    #player2;
    /** 
     * @property {string} gameHash game identifier
     * @type {string}
     */
    #gameHash;
    #group;

    /**
     * @param {Board} board
     * @param {Player} player1
     * @param {Player} player2
     * @param {gameHash} gameHash
     */
    constructor(board, player1, player2, gameHash, group) {
        this.#state;
        this.#board = board;
        this.#player1 = player1;
        this.#player2 = player2;
        this.#gameHash = gameHash;
        this.#group = group;
    }

    get gameHash() {
        return this.#gameHash;
    }

    get group() {
        return this.#group;
    }

    get board() {
        return this.#board;
    }

    get player1() {
        return this.#player1;
    }

    get player2() {
        return this.#player2;
    }

    set player2(player2) {
        this.#player2 = player2;
    } 

    /**
     * @returns {Player}
     */
    get currentPlayer() {
        return this.#state.player;
    }

    parseBoard() {
        const obj = {
            sides: {},
            turn: this.currentPlayer.name,
        }

        obj.sides[this.#player1.name] = {
            store: this.#board.getStorageAmount(this.#player1.id),
            pits: this.#board.seeds.slice(0, this.#board.nHoles),
        } 

        obj.sides[this.#player2.name] = {
            store: this.#board.getStorageAmount(this.#player2.id),
            pits: this.#board.seeds.slice(this.#board.nHoles, this.#board.nHoles * 2),
        }

        return obj;
    }

    getStores() {
        const obj = {

        }

        obj[this.#player1.name] = this.#board.getStorageAmount(0);
        obj[this.#player2.name] = this.#board.getStorageAmount(1);

        return obj;
    }

    /**
     * Changes the current game state and starts the state.
     * 
     * @param {GameState} state 
     */
    changePlayerState(state) {
        this.#state = state;
    }

    /**
     * Ends the game.
     * 
     * @param {number} playerId The player without seeds.
     */
    endGame() {
        const endState = new EndState(this, this.#player1, this.#player2);
        this.changePlayerState(endState);

        return endState.getWinner();
    }

    /**
     * Collects all remaining seeds in the board and stores them in the appropriate storage.
     */
    collectAllSeeds() {
        for (let playerID = 0; playerID <= 1; playerID++) {
            let avail = this.#board.getAvailHoles(playerID);

            avail.forEach((hole) => {
                let seeds = this.#board.getHoleSeedAmount(hole);

                for (let i = 0; i < seeds; i++) {
                    this.#board.moveToStorage(hole, playerID);
                }
            });
        }
    }

    getEndStorage() {
        const storage = this.#board.storage.slice();

        for (let playerID = 0; playerID <= 1; playerID++) {
            let avail = this.#board.getAvailHoles(playerID);

            avail.forEach((hole) => {
                let seeds = this.#board.getHoleSeedAmount(hole);

                storage[playerID] += seeds;
            });
        }

        return storage;
    }

    /**
     * Handles the click event on a hole.
     * 
     * @param {string} playerName The name of the player who clicked the hole.
     * @param {GameResponse} hole The clicked hole.
     */
    clickHole(playerName, hole) {
        const player = playerName === this.#player1.name ? this.#player1 : playerName === this.#player2.name ? this.#player2 : null;
        if(player == null) {
            return new GameResponse(WRONG_TURN);
        }

        let realHole = this.#board.getRealHole(hole, player.id);
        return this.#state.clickHole(playerName, realHole);
    } 
}

module.exports = Game;
