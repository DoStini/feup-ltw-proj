const GameController = require("../src/services/gameController");
const assert = require('assert/strict');
const { WRONG_TURN, INVALID_HOLE, OK, GAME_END } = require("../src/constants");
const DatabaseModel = require("../src/database/DatabaseModel");
const SqlDatabase = require("../src/database/SqlDatabase");
const SqlModel = require("../src/database/SqlModel");
const UserController = require("../src/services/user");

class FakeModel extends DatabaseModel {

}

class FakeController extends UserController {
    addGame() {


    }

    addWin() {

    }
}

const fakeModel = new FakeModel("fake");
const fakeController = new FakeController(fakeModel);

const gameTests = [
    async function testFailsTurn() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno", 1);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsTurn2() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno2", 1);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsHole() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", -1);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsHole2() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 2);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsHole2() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 7);
        assert.deepStrictEqual(response.status, INVALID_HOLE);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsBoth() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("nuno", 7);
        assert.deepStrictEqual(response.status, WRONG_TURN);
        assert.deepStrictEqual(game.board.seeds, [2, 2, 2, 2]);
        assert.deepStrictEqual(game.board.storage, [0, 0]);
        assert.deepStrictEqual(game.currentPlayer.name, "mafalda");
    },

    async function testFailsEmptyHole() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

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

    async function testGame() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(2, 2, "mafalda", "nuno", "mafalda", "as31234");

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

    async function testGame2() {
        let game = await new GameController(fakeModel, fakeController).setupMultiplayerGame(1, 1, "mafalda", "nuno", "mafalda", "as31234");

        let response = game.clickHole("mafalda", 0);
        assert.deepStrictEqual(response.status, GAME_END);
        assert.deepStrictEqual(game.board.seeds, [1, 0]);
        assert.deepStrictEqual(game.board.storage, [0, 1]);
        assert.deepStrictEqual(response.winner, null);
    },

    async function testDBGame() {
        const database = new SqlDatabase(":memory:");
        const gameModel = new SqlModel("game", [
            {name: "hash", type: "TEXT", constraint: "PRIMARY KEY"},
            {name: "player1", type: "TEXT", constraint : ""},
            {name: "player2", type: "TEXT", constraint: ""},
            {name: "board", type: "TEXT", constraint: ""},
            {name: "turn", type: "TEXT", constraint: ""},
        ], database);
        database.addModel(gameModel);

        await database.setup();
        let controller =  new GameController(gameModel, fakeController);

        let game = await controller.setupMultiplayerGame(1, 1, "mafalda", "nuno", "mafalda", "as31234");
        let [game2Obj] = await gameModel.findByKey("hash", "as31234");
        let game2 = controller.objectToGame(game2Obj);

        assert.deepStrictEqual(game2.board.toJSON(), game.board.toJSON());
        assert.deepStrictEqual(game2.player1.name, game.player1.name);
        assert.deepStrictEqual(game2.player2.name, game.player2.name);
        assert.deepStrictEqual(game2.currentPlayer.name, game.currentPlayer.name);
        assert.deepStrictEqual(game2.gameHash, game.gameHash);
    },

    async function testDBGame1() {
        const database = new SqlDatabase(":memory:");
        const gameModel = new SqlModel("game", [
            {name: "hash", type: "TEXT", constraint: "PRIMARY KEY"},
            {name: "player1", type: "TEXT", constraint : ""},
            {name: "player2", type: "TEXT", constraint: ""},
            {name: "board", type: "TEXT", constraint: ""},
            {name: "turn", type: "TEXT", constraint: ""},
        ], database);
        database.addModel(gameModel);

        await database.setup();
        let controller =  new GameController(gameModel, fakeController);

        let game = await controller.setupMultiplayerGame(2, 1, "mafalda", "nuno", "mafalda", "as31234");
        await controller.clickHole("mafalda", "as31234", 1);
        let [gameObj] = await gameModel.findByKey("hash", "as31234");
        let game2 = controller.objectToGame(gameObj);

        assert.deepStrictEqual(game2.board.storage, [0, 1]);
        assert.deepStrictEqual(game2.board.seeds, [1, 1, 1, 0]);
        assert.deepStrictEqual(game2.player1.name, "nuno");
        assert.deepStrictEqual(game2.player2.name, "mafalda" );
        assert.deepStrictEqual(game2.currentPlayer.name, "mafalda");
        assert.deepStrictEqual(game2.gameHash, game.gameHash);
    },

    async function testDBGameEnd() {
        const database = new SqlDatabase(":memory:");
        const gameModel = new SqlModel("game", [
            {name: "hash", type: "TEXT", constraint: "PRIMARY KEY"},
            {name: "player1", type: "TEXT", constraint : ""},
            {name: "player2", type: "TEXT", constraint: ""},
            {name: "board", type: "TEXT", constraint: ""},
            {name: "turn", type: "TEXT", constraint: ""},
        ], database);
        database.addModel(gameModel);

        await database.setup();
        let controller =  new GameController(gameModel, fakeController);

        let game = await controller.setupMultiplayerGame(1, 1, "mafalda", "nuno", "mafalda", "as31234");
        let {result, game: game2} = await controller.clickHole("mafalda", "as31234", 0);
        let [gameObj] = await gameModel.findByKey("hash", "as31234");


        assert.deepStrictEqual(gameObj, undefined)
        assert.deepStrictEqual(result.status, GAME_END);
        assert.deepStrictEqual(result.winner, null);
        assert.deepStrictEqual(game2.board.storage, [0, 1]);
        assert.deepStrictEqual(game2.board.seeds, [1, 0]);
        assert.deepStrictEqual(game2.player1.name, "nuno");
        assert.deepStrictEqual(game2.player2.name, "mafalda" );
        assert.deepStrictEqual(game2.gameHash, game.gameHash);
    }
]

gameTests.forEach((fn) => fn());

