const GameController = require("../src/controllers/gameController");
const assert = require('assert/strict');
const { WRONG_TURN, INVALID_HOLE, OK, GAME_END } = require("../src/constants");

const gameTests = [
    function testFailsTurn() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno", 1);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsTurn2() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno2", 1);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsHole() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", -1);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsHole2() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 2);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsHole2() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 7);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsBoth() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno", 7);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testFailsEmptyHole() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 0);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 0, 3]);
        assert.deepStrictEqual(game.board.storage, [0, 1]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");

        response = game.clickHole("mafalda", 0);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 0, 3]);
        assert.deepStrictEqual(game.board.storage, [0, 1]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    function testGame() {
        let game = GameController.setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 1);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [3, 2, 2, 0]);
        assert.deepStrictEqual(game.board.storage, [0, 1]);
        assert.deepStrictEqual(game.currentPlayer.name, "nuno");

        response = game.clickHole("nuno", 1);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [3, 0, 3, 0]);
        assert.deepStrictEqual(game.board.storage, [1, 1]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");

        response = game.clickHole("mafalda", 0);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [4, 0, 0, 1]);
        assert.deepStrictEqual(game.board.storage, [1, 2]);
        assert.deepStrictEqual(game.currentPlayer.name, "nuno");

        response = game.clickHole("nuno", 0);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [0, 1, 1, 2]);
        assert.deepStrictEqual(game.board.storage, [2, 2]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");

        response = game.clickHole("mafalda", 1);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [1, 1, 1, 0]);
        assert.deepStrictEqual(game.board.storage, [2, 3]);
        assert.deepStrictEqual(game.currentPlayer.name, "nuno");

        response = game.clickHole("nuno", 1);
        assert.deepStrictEqual(response.status, OK);
        assert.deepStrictEqual(game.board.seeds, [1, 0, 1, 0]);
        assert.deepStrictEqual(game.board.storage, [3, 3]);
        assert.deepStrictEqual(game.currentPlayer.name, "nuno");

        response = game.clickHole("nuno", 0);
        assert.deepStrictEqual(response.status, GAME_END);
        assert.deepStrictEqual(game.board.seeds, [0, 0, 0, 0]);
        assert.deepStrictEqual(game.board.storage, [5, 3]);
        assert.deepStrictEqual(game.currentPlayer.name, "nuno");
        assert.deepStrictEqual(response.winner.name, "nuno");
    },

    function testGame2() {
        let game = GameController.setupMultiplayerGame(1, 1, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 0);
        assert.deepStrictEqual(response.status, GAME_END);
        assert.deepStrictEqual(game.board.seeds, [1, 0]);
        assert.deepStrictEqual(game.board.storage, [0, 1]);
        assert.deepStrictEqual(response.winner, null);
    }
]

gameTests.forEach((fn) => fn());

