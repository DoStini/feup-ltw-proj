const Board = require("../models/board");
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
     * @returns {Object.<number, Array.<number>>}
     */
    sowSeeds(hole) {
        let seeds = this.board.getHoleSeedAmount(hole);
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = {};

        destHoles[hole] = [];

        for (let i = 0; i < seeds; i++) {
            if (lastHole === this.player.id * this.board.nHoles + this.board.nHoles - 1) {
                this.board.moveToStorage(hole, this.player.id);

                lastHole = this.board.nHoles * 2 + this.player.id;
                destHoles[hole].push(lastHole);
            } else {
                curHole = (curHole + 1) % (this.board.nHoles * 2);
                this.board.moveToHole(hole, curHole);

                destHoles[hole].push(curHole);
                lastHole = curHole;
            }
        }

        return destHoles;
    }

    /**
     * @param {number} lastHole
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    captureSeeds(lastHole) {
        let holeToHoles = {};

        if (this.board.holeBelongsToPlayer(lastHole, this.player.id) && this.board.getHoleSeedAmount(lastHole) === 1) {
            let storage = this.board.nHoles * 2 + this.player.id;
            let oppositeHole = this.board.nHoles * 2 - 1 - lastHole;
            let oppositeSeeds = this.board.getHoleSeedAmount(oppositeHole);

            for (let i = 0; i < oppositeSeeds; i++) {
                this.board.moveToStorage(oppositeHole, this.player.id);
            }
            this.board.moveToStorage(lastHole, this.player.id);

            holeToHoles[lastHole] = [storage];
            holeToHoles[oppositeHole] = Array(oppositeSeeds).fill(storage);
        }

        return holeToHoles;
    }

    /**
     * Checks if player can play again.
     * 
     * @param {number} lastHole The hole where the last seed was placed
     * @returns {boolean}
     */
    checkChain(lastHole) {
        return lastHole == this.board.nHoles * 2 + this.player.id;
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
        const holeToHoles = this.sowSeeds(hole);
        const destHoles = holeToHoles[hole];
        const lastHole = destHoles[destHoles.length - 1];

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
     * @param {number} hole 
     */
    clickHole(hole) { }

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

    clickHole(hole) {
        if (this.board.getHoleSeedAmount(hole) === 0) return;
        if (!this.board.holeBelongsToPlayer(hole, this.player.id)) return;


        const newState = this.play(hole);

        if (this.checkEnd()) {
            return this.game.endGame();
        } else {
            this.game.changePlayerState(newState);

            return 0;
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
        this.game.collectAllSeeds();

        const score1 = this.board.getStorageAmount(this.player.id);
        const score2 = this.board.getStorageAmount(this.otherPlayer.id);

        const winner = score1 > score2 ? this.player : this.otherPlayer;

        if (score1 === score2) {
            return null;
        } else {
            return winner;
        }
    }
}

module.exports = { GameState, PlayerState, EndState}
