const Board = require("../models/board");
const Player = require("../models/player");
const Game = require("../controllers/mancala");
const { PlayerState } = require("../controllers/gameStates");
const DatabaseModel = require("../database/DatabaseModel");

class GameController {
    /** @type {DatabaseModel}  */
    #model;

    /**
     * @param {DatabaseModel} model
     */
    constructor(model) {
        this.#model = model;
    }

    /**
     * 
     * @param {Game} game 
     * @returns {{board: string, hash: string, player1: string, player2: string, turn: string}} 
     */
    #gameToObject(game) {
        return {
            hash: game.gameHash,
            player1: game.player1.name,
            player2: game.player2.name,
            turn: game.currentPlayer.name,
            board: game.board.toJSON()
        }
    }

    /**
     * @param {{board: string, hash: string, player1: string, player2: string, turn: string}} json 
     * 
     * @returns {Game}
     */
    objectToGame(json) {
        const boardObj = JSON.parse(json.board);
        const board = new Board(boardObj.nHoles, boardObj.nSeeds, json.board);

        const player1 = new Player(0, json.player1);
        const player2 = new Player(1, json.player2);

        const game = new Game(board, player1, player2, json.hash);

        if(json.turn === player1.name) {
            game.changePlayerState(new PlayerState(game, player1, player2));
        } else {
            game.changePlayerState(new PlayerState(game, player2, player1));
        }
        
        return game;
    }

    /**
     * 
     * @param {number} nHoles 
     * @param {number} seedsPerHole 
     * @param {string} turn 
     * @param {string} player1Name 
     * @param {string} player2Name 
     * @param {string} hash 
     * @returns {Game}
     */
    async setupMultiplayerGame(nHoles, seedsPerHole, turn, player1Name, player2Name, hash) {
        const board = new Board(nHoles, seedsPerHole);
    
        const player1 = new Player(0, player1Name);
        const player2 = new Player(1, player2Name);
    
        let game = new Game(board, player1, player2, hash);
    
        if (turn === player1.name) {
            game.changePlayerState(new PlayerState(game, player1, player2));
        } else {
            game.changePlayerState(new PlayerState(game, player2, player1));
        }

        let obj = this.#gameToObject(game);
        await this.#model.insert(hash, obj);

        return game;
    }

    async clickHole(player, hash, hole) {
        let game = this.objectToGame(await this.#model.findByKey("hash", hash)[0]);

        let result = game.clickHole(player, hole);
        let obj = this.#gameToObject(game);
        await this.#model.update("hash", hash, obj);
        
        return result;
    }
}

module.exports = GameController;