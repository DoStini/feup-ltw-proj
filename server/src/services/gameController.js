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

    #handlers;

    /**
     * @param {DatabaseModel} model
     */
    constructor(model, userController) {
        this.#model = model;
        this.#userController = userController;
        this.#handlers = {};
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

    registerEvent(user, handler) {
        this.#handlers[user] = handler;
    }

    async startGameNotify(hash) {
        const [game] = await this.#model.findByKey("hash", hash);
        if (game.player1 === "null" || game.player2 === "null") {
            return;
        }

        await this.notifyAll(hash, {
            board: this.objectToGame(game).parseBoard()
        });
    }

    async notifyAll(hash, data) {
        const [game] = await this.#model.findByKey("hash", hash);

        this.notify(game.player1, data);
        this.notify(game.player2, data);
    }

    notify(user, data) {
        this.#handlers[user].write(`data: ${JSON.stringify(data)}\n\n`);
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
        
        return this.createGame(parseInt(boardObj.nHoles), parseInt(boardObj.nSeeds), json.turn, json.player1, json.player2, json.hash, json.board);
    }

    async playerInGame(nick) {
        const [data] = await this.#model.findByKey("player1", nick);
        const [data2] = await this.#model.findByKey("player2", nick);

        if(data != null) {
            return data.hash;
        } else if (data2 != null) {
            return data2.hash;
        } else {
            return null;
        }
    }

    async players(game) {
        const [gameObj] = await this.#model.findByKey("hash", game);
        
        return [gameObj.player1, gameObj.player2];
    }

    async getAllGames() {
        return await this.#model.all();
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
     * @param {number} nHoles 
     * @param {number} nSeeds 
     * @returns {Game}
     */
    async findGame(nHoles, nSeeds) {
        let games = await this.#model.findByKey("player2", "null");
        
        for(let game of games) {
            let board = JSON.parse(game.board);
            let initial = board.nSeeds;
            let size = board.nHoles;

            if(nHoles === size && nSeeds === initial) {
                return this.objectToGame(game);
            }
        }

        return null;
    }

    /**
     * 
     * @param {string} player 
     * @param {string} hash 
     */
    async leaveGame(player, hash) {
        let [game] = await this.#model.findByKey("hash", hash);
        if(game == null) return null;

        const otherPlayer = game.player1 === player ? game.player2 : game.player1;
        if(otherPlayer != "null") {
            await this.#userController.addGame(player);
            await this.#userController.addWin(otherPlayer);

            await this.notifyAll(hash, {winner: otherPlayer});
        }

        this.#model.delete("hash", hash);
    }

    /**
     * 
     * @param {Game} game 
     * @param {string} player2 
     */
    async addPlayer2(game, player2) {
        game.player2 = new Player(1, player2);

        await this.#model.update("hash", game.gameHash, this.#gameToObject(game));
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
            if(result.winner === null) {
                this.#userController.addGame(game.player1.name);
                this.#userController.addGame(game.player2.name)
            } else {
                const loserName = game.player1.name === result.winner ? game.player2.name : game.player1.name;
                this.#userController.addWin(result.winner);
                this.#userController.addGame(loserName);
            }
        }

        await this.#model.update("hash", hash, obj);

        return {result, game};
    }

    async endGame(hash) {
        let [game] = await this.#model.findByKey("hash", hash);

        delete this.#handlers[game.player1];
        delete this.#handlers[game.player2];

        await this.#model.delete("hash", hash);
    }
}

module.exports = GameController;