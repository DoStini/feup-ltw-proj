const Board = require("../models/board");
const Player = require("../models/player");
const Game = require("../controllers/mancala");
const { PlayerState } = require("../controllers/gameStates");
const DatabaseModel = require("../database/DatabaseModel");
const { GAME_END } = require("../constants");
const GameResponse = require("../models/gameResponse");
const UserController = require("./user");

class GameController {
    /** @type {DatabaseModel}  */
    #model;
    /** @type {UserController} */
    #userController;

    /**
     * @param {DatabaseModel} model
     */
    constructor(model, userController) {
        this.#model = model;
        this.#userController = userController;
        
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

    createGame(nHoles, nSeeds, turn, player1Name, player2Name, hash, boardJSON) {
        const board = new Board(nHoles, nSeeds, boardJSON);

        const player1 = new Player(0, player1Name);
        const player2 = new Player(1, player2Name);

        const game = new Game(board, player1, player2, hash);

        if(turn === player1.name) {
            game.changePlayerState(new PlayerState(game, player1, player2));
        } else {
            game.changePlayerState(new PlayerState(game, player2, player1));
        }
        
        return game;
    }

    /**
     * @param {{board: string, hash: string, player1: string, player2: string, turn: string}} json 
     * 
     * @returns {Game}
     */
    objectToGame(json) {
        const boardObj = JSON.parse(json.board);
        
        return this.createGame(boardObj.nHoles, boardObj.nSeeds, json.turn, json.player1, json.player2, json.hash, json.board);
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
        let game = this.createGame(nHoles, seedsPerHole, turn, player1Name, player2Name, hash);

        let obj = this.#gameToObject(game);
        await this.#model.insert(hash, obj);

        return game;
    }

    /**
     * 
     * @param {string} player 
     * @param {string} hash 
     * @param {number} hole 
     * @returns 
     */
    async clickHole(player, hash, hole) {
        let game = this.objectToGame((await this.#model.findByKey("hash", hash))[0]);

        let result = game.clickHole(player, hole);
        let obj = this.#gameToObject(game);

        if(result.status === GAME_END) {
            await this.#model.delete("hash", hash);


        } else {
            await this.#model.update("hash", hash, obj);
        }

        return {result, game};
    }
}

module.exports = GameController;