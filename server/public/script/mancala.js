"use strict";

function addMessage(messageText) {
    const message = document.createElement("span");
    const board = document.getElementById("message-board");

    message.innerText = messageText;
    message.classList.add("message");
    board.insertBefore(message, board.firstChild);
}

class Game {
    /** @property {GameState} state The current game state.*/
    #state;
    /** @property {Board} board The game board */
    #board;
    /** @property {Player} player1 The player with ID 0 */
    #player1;
    /** @property {Player} player2 The player with ID 1 */
    #player2;
    /** @property {number} turn The turn number which is incremented */
    #turn;
    /** @property {Renderer} boardRenderer */
    #boardRenderer;
    /** @property {Renderer} statusRenderer */
    #statusRenderer

    /**
     * @param {Board} board
     * @param {Player} player1
     * @param {Player} player2
     * @param {Renderer} board
     * @param {Renderer} statusRenderer
     */
    constructor(board, player1, player2, boardRenderer, statusRenderer) {
        this.#state;
        this.#board = board;
        this.#player1 = player1;
        this.#player2 = player2;
        this.#turn = 0;

        if (boardRenderer == null) {
            this.#boardRenderer = new BoardRenderer();
        } else {
            this.#boardRenderer = boardRenderer;
        }

        if (statusRenderer == null) {
            this.#statusRenderer = new StatusRenderer();
        } else {
            this.#statusRenderer = statusRenderer;
        }
    }

    get turn() {
        return this.#turn;
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

    /**
     * @returns {Player}
     */
    get currentPlayer() {
        return this.#state.player;
    }

    /**
     * Changes the current game state and starts the state.
     * 
     * @param {GameState} state 
     */
    changePlayerState(state) {
        this.#state = state;
        this.#state.run();
    }

    /**
     * Ends the game.
     * 
     * @param {number} playerId The player without seeds.
     */
    endGame() {
        this.changePlayerState(new EndState(this, this.#player1, this.#player2));
    }

    /**
     * Ends the multiplayer game.
     * 
     * @param {Player} winner The player who won.
     */
    endMPGame(winner) {
        pageManager.pageCleanup["game-section"] = cleanupGame;

        this.changePlayerState(new EndState(this, this.#player1, this.#player2, winner, this.#state.animator));
    }

    /**
     * Increments the turn value.
     */
    nextTurn() {
        this.#turn++;
    }

    /**
     * Renders the HTML elements.
     */
    renderAll() {
        this.#boardRenderer.render(this.#board);
        this.setupHoles();
        this.#statusRenderer.render(this);
    }

    /**
     * Collects all remaining seeds in the board and stores them in the appropriate storage.
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    collectAllSeeds() {
        let destHoles = {};

        for (let playerID = 0; playerID <= 1; playerID++) {
            let avail = this.#board.getAvailHoles(playerID);

            avail.forEach((hole) => {
                let storage = this.#board.nHoles * 2 + playerID
                let seeds = this.#board.getHoleSeedAmount(hole);
                destHoles[hole] = Array(seeds).fill(storage);

                for (let i = 0; i < seeds; i++) {
                    this.#board.moveToStorage(hole, playerID);
                }
            });
        }

        return destHoles;
    }

    /**
     * Adds the click event and hover css style to the holes.
     */
    setupHoles() {
        let holes = document.querySelectorAll(".hole")

        holes.forEach(hole => {
            let curHole = parseInt(hole.id.split("-")[1]);
            hole.addEventListener('click', this.clickHole.bind(this, curHole))
        })

        if (this.#state instanceof PlayerState || (this.#state instanceof PlayMPState)) {
            holes.forEach(hole => {
                let curHole = parseInt(hole.id.split("-")[1]);

                if (this.#board.holeBelongsToPlayer(curHole, this.#state.player.id)) {
                    hole.classList.add("player-hole");
                }
            })
        }
    }

    /**
     * Handles the click event on a hole.
     * 
     * @param {number} hole The clicked hole.
     */
    clickHole(hole) {
        this.#state.clickHole(hole);
    }
}

function setupLocalGame(nHoles, seedsPerHole, turn) {
    const board = new Board(parseInt(nHoles), seedsPerHole);

    const player1 = new Player(0, "Player 1");
    const player2 = new Player(1, "AI");

    const game = new Game(board, player1, player2);

    if (turn === 0) {
        game.changePlayerState(new PlayerState(game, player1, player2));
    } else {
        game.changePlayerState(new PlayAIState(game, player2, player1));
    }

    game.renderAll();
}

function setupMultiplayerGame(nHoles, seedsPerHole, turn, playerName, enemyName, mInfo) {
    const board = new Board(nHoles, seedsPerHole);

    const player1 = new Player(0, playerName);
    const player2 = new Player(1, enemyName);

    const game = new Game(board, player1, player2);

    if (turn === player1.name) {
        game.changePlayerState(new PlayMPState(game, player1, player2, mInfo));
    } else {
        game.changePlayerState(new WaitMPState(game, player2, player1, mInfo));
    }

    game.renderAll();
}
