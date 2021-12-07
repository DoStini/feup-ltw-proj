"use strict";

function addMessage(messageText) {
    const message = document.createElement("span");
    const board = document.getElementById("message-board");

    message.innerText = messageText;
    message.classList.add("message");
    board.insertBefore(message, board.firstChild);
}

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Seed {
    constructor(id) {
        this.id = id;
        this.x = Math.random() * 60;
        this.y = Math.random() * (70 - 8) + 8;
        this.rot = Math.random() * 90;
    }

    render(parent) {
        const newElem = document.createElement("div");
        newElem.id = `seed${this.id}`;
        newElem.className = "seed";
        newElem.style.left = this.x + "%";
        newElem.style.top = this.y + "%";
        newElem.style.transform = `rotate(${this.rot}deg)`;

        parent.appendChild(newElem);
    }

}

class Board {
    constructor(nHoles, nSeeds) {
        this.storage = [[], []];
        this.nHoles = nHoles;
        this.nSeeds = nSeeds;
        this.generateSeeds();
    }

    generateSeeds() {
        const container = [];

        for (let h = 0; h < this.nHoles * 2; h++) {
            container.push([]);
            for (let s = 0; s < this.nSeeds; s++) {
                container[h][s] = new Seed(h*this.nSeeds + s);
            }
        }

        this.seeds = container;
    }

    

    render () {
        const boardElement = document.getElementById("board");
        let nHoles = this.nHoles;
    
        document.querySelectorAll("div.seed-box")
            .forEach(el => {
                el.style['grid-template-columns'] = `repeat(${this.nHoles}, 1fr)`;
            });

        boardElement.style['grid-template-columns'] = `repeat(${this.nHoles}, 1fr)`;

        document.getElementById("board").innerHTML = null;

        [1,0].forEach(el => {
            const seedCounterWrapper = document.getElementById(`seeds${el}`);
            seedCounterWrapper.innerHTML = "";

            for (let i = 0; i < this.nHoles; i++) {
                const idx = i + el * this.nHoles;
                const seedCounter = document.createElement("span");
                seedCounter.className = "seed-num";
                seedCounter.id = `seeds${el}-${el === 0 ? i : this.nHoles - i}`;
                console.log(idx, this.seeds)

                seedCounter.innerHTML = this.seeds[idx].length;
                seedCounterWrapper.appendChild(seedCounter);

                const seedHole = document.createElement("div");
                seedHole.className = `hole${el === 0 ? " player-hole" : ""}`;
                console.log(seedHole)
                seedHole.id = `hole${el}-${el === 0 ? i : this.nHoles - i}`;
                boardElement.appendChild(seedHole);
                this.seeds[idx].forEach(seed => {
                    seed.render(seedHole);
                });
            }
        });
    }

    selectSeeds(player, hole) {

    }
}

class GameState {
    /**
    * 
    * @param {Game} game
    * @param {Board} board 
    * @param {Player} player
    */
    constructor(game, board, player) {
        this.board = board;
        this.game = game;
        this.player = player;
    }
    /**
     *
     * @param {Game} game
     * @param {number} hole
     */
    sowSeeds(hole) { console.log("nothing to do in " + hole); }
    run() { }
    nextState() { };
}


class PlayerState extends GameState {
    constructor(game, board, player) {
        super(game, board, player);
    }

    /**
     *
     * @param {number} hole
     */
    sowSeeds(hole) {
        console.log(hole);

        this.nextState();
    }
    
    run() {
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");

        addMessage(MESSAGE.otherTurn(this.player.name));

        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole0-${i}`).classList.add("player-hole");
        }
    }

    nextState() {
        return new WaitState(this.game, this.board, this.player);
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
class WaitState extends GameState {
    constructor(game, board, player) {
        super(game, board, player);
    }

    run() {
        document.getElementById(`name${this.player.id}`).classList.remove("player-turn");

        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole0-${i}`).classList.remove("player-hole");
        }
    }

    nextState() {
        return new PlayerState(this.game, this.board, this.player);
    }
}

class PlayAIState extends GameState {
    constructor(game, board, player) {
        super(game, board, player);
    }

    run() {
        addMessage(MESSAGE.otherTurn(this.player.name));

        setTimeout(function () {
            this.game.nextPlayerState();
            this.nextState();
        }.bind(this), 2000);
    }

    nextState() {
        return new WaitAIState(this.game, this.board, this.player);
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
 class WaitAIState extends GameState {
    constructor(game, board, player) {
        super(game, board, player);
    }

    run() {
        document.getElementById(`name${this.player.id}`).classList.remove("player-turn");
    }

    nextState() {
        return new PlayAIState(this.game, this.board, this.player);
    }
}

/**
 * 
 * @param {GameState} state 
 */
class Game {
    constructor() {
        this.playerState;
        this.enemyState;
    }
    /**
     *
     * @param {GameState} state
     */

    nextPlayerState() {
        this.changePlayerState(this.playerState.nextState());
    }
    nextEnemyState() {
        this.changeEnemyState(this.enemyState.nextState());
    }

    changePlayerState(state) {
        this.playerState = state;
        this.playerState.run();
    }

    changeEnemyState(state) {
        this.enemyState = state;
        this.enemyState.run();
    }

    sowSeeds(hole) {
        this.playerState.sowSeeds(hole);
    }
}


/**
 * 
 * @param {Board} board  
 */
function setupBoard(board) {

    board.render();
}

/**
 * 
 * @param {Board} board  
 */
function setupSeeds(board) {
    
}

/**
 * 
 * @param {Game} board  
 */
function setupHoles(game) {
    document.querySelectorAll(".player-hole").forEach(hole => {
        let curHole = parseInt(hole.id.split("-")[1]);

        hole.addEventListener('click', game.sowSeeds.bind(game, curHole))
    })
}

function setupGame(nHoles, seedsPerHole, turn) {
    const board = new Board(nHoles, seedsPerHole);
    setupBoard(board);
    setupSeeds(board);

    let gameState, enemyState;

    const game = new Game();
    const player1 = new Player(0, "Player 1");
    const player2 = new Player(1, "AI");
    if (turn === 0) {
        gameState = new PlayerState(game, board, player1);
        enemyState = new WaitAIState(game, board, player2);
    } else {
        gameState = new WaitState(game, board, player1);
        enemyState = new PlayAIState(game, board, player2);
    }
    game.changePlayerState(gameState);
    game.changeEnemyState(enemyState);

    setupHoles(game);
}