const { WRONG_TURN, INVALID_HOLE, GAME_END, OK } = require("../constants");
const Board = require("../models/board");
const GameResponse = require("../models/gameResponse");
const Player = require("../models/player");
const Game = require("./mancala");

class GameState {
    /** @property {Game} game */
    game;
    /** @property {Player} player */
    player;
    /** @property {Player} otherPlayer */
    otherPlayer;
    /**
    * 
    * @param {Game} game
    * @param {Player} player
    * @param {Player} otherPlayer
    */
    constructor(game, player, otherPlayer) {
        this.game = game;
        this.player = player;
        this.otherPlayer = otherPlayer;
    }

    /**
     * @returns {Board}
     */
    get board() {
        return this.game.board;
    }

    /**
     * @param {number} hole
     * 
     * @returns {number}
     */
    sowSeeds(hole) {
        let seeds = this.board.getHoleSeedAmount(hole);
        let lastHole = hole
        let curHole = lastHole;

        for (let i = 0; i < seeds; i++) {
            if (lastHole === this.board.getLastHole(this.player.id)) {
                this.board.moveToStorage(hole, this.player.id);

                lastHole = this.board.getStorageID(this.player.id);
            } else {
                curHole = this.board.getNextHole(curHole);
                this.board.moveToHole(hole, curHole);

                lastHole = curHole;
            }
        }

        return lastHole;
    }

    /**
     * @param {number} lastHole
     */
    captureSeeds(lastHole) {
        if (this.board.holeBelongsToPlayer(lastHole, this.player.id) && this.board.getHoleSeedAmount(lastHole) === 1) {
            let oppositeHole = this.board.getOppositeHole(lastHole);
            let oppositeSeeds = this.board.getHoleSeedAmount(oppositeHole);

            for (let i = 0; i < oppositeSeeds; i++) {
                this.board.moveToStorage(oppositeHole, this.player.id);
            }
            this.board.moveToStorage(lastHole, this.player.id);
        }
    }

    /**
     * Checks if player can play again.
     * 
     * @param {number} lastHole The hole where the last seed was placed
     * @returns {boolean}
     */
    checkChain(lastHole) {
        return lastHole === this.board.getStorageID(this.player.id);
    }

    /**
     * Checks if the game has ended.
     * 
     * @returns {boolean} true if game ended, or false if game didn't end.
     */
    checkEnd() {
        for (let playerID = 0; playerID <= 1; playerID++) {
            const avail = this.board.getAvailHoles(playerID);

            if (avail.length === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sows and if possible captures given the played hole.
     * 
     * @param {number} hole 
     * @returns {boolean}
     */
    sowAndCapture(hole) {
        const lastHole = this.sowSeeds(hole);
        this.captureSeeds(lastHole)

        return this.checkChain(lastHole);
    }

    /**
     * Plays a turn given a hole.
     * 
     * @param {number} hole
     * @returns {Promise<GameState>} The next game state.
     */
    play(hole) {
        const chain = this.sowAndCapture(hole);

        if (chain) {
            return this.getCurrentState();
        }
        return this.getNextState();
    }

    /**
     * Handles clicking a hole
     * 
     * @param {string} playerName
     * @param {number} hole 
     */
    clickHole(playerName, hole) { }

    /**
     * Gets the next player turn state.
     * 
     * @returns {GameState} The next state.
     */
    getNextState() { };

    /**
     * Gets the current player turn state.
     * 
     * @returns {GameState} The current state.
     */
    getCurrentState() { return this; };
}

class PlayerState extends GameState {
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    getNextState() {
        return new PlayerState(this.game, this.otherPlayer, this.player);
    }

    clickHole(playerName, hole) {
        if (this.player.name !== playerName) {
            return new GameResponse(WRONG_TURN);
        }
        if (this.board.getHoleSeedAmount(hole) === 0) {
            return new GameResponse(INVALID_HOLE);
        }
        if (!this.board.holeBelongsToPlayer(hole, this.player.id)) {
            return new GameResponse(INVALID_HOLE);
        }

        const newState = this.play(hole);

        if (this.checkEnd()) {
            const winner = this.game.endGame();
            const response = new GameResponse(GAME_END);
            response.winner = winner;

            return response;
        } else {
            this.game.changePlayerState(newState);

            return new GameResponse(OK);
        }
    }
}

class EndState extends GameState {
    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @param {Player} otherPlayer
     */
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    /**
     * 
     * @returns {Player}
     */
    getWinner() {
        const storage = this.game.getEndStorage();

        const score1 = storage[this.player.id];
        const score2 = storage[this.otherPlayer.id];

        const winner = score1 > score2 ? this.player : this.otherPlayer;

        if (score1 === score2) {
            return null;
        } else {
            return winner;
        }
    }
}

module.exports = { GameState, PlayerState, EndState}
