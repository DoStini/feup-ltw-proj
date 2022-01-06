const Board = require("../models/board");
const Player = require("../models/player");
const Game = require("./mancala");
const { PlayerState } = require("./gameStates");

class GameController {
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
    static setupMultiplayerGame(nHoles, seedsPerHole, turn, player1Name, player2Name, hash) {
        const board = new Board(nHoles, seedsPerHole);
    
        const player1 = new Player(0, player1Name);
        const player2 = new Player(1, player2Name);
    
        const game = new Game(board, player1, player2, hash);
    
        if (turn === player1.name) {
            game.changePlayerState(new PlayerState(game, player1, player2));
        } else {
            game.changePlayerState(new PlayerState(game, player2, player1));
        }
    
        return game;
    }
}

module.exports = GameController;