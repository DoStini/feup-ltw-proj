"use strict";

function Board(nHoles, nSeeds) {
    this.seeds = new Array(2);

    for (let i = 0; i < 2; i++) {
        this.seeds[i] = new Array(nHoles);

        for (let j = 0; j < nHoles; j++) {
            this.seeds[i][j] = nSeeds;
        }
    }

    this.storage = [0, 0];
    this.nHoles = nHoles;
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
function GameState(game, board) {
    this.board = board;
    this.game = game;
}

/**
 * 
 * @param {Game} game
 * @param {number} hole 
 */
GameState.prototype.sowSeeds = function(hole) {}

GameState.prototype.run = function() {}


function PlayerState(game, board) {
    GameState.call(this, game, board);
}

PlayerState.prototype = Object.create(GameState.prototype);
Object.defineProperty(PlayerState.prototype, 'constructor', {
    value: PlayerState,
    enumerable: false,
    writable: true
})

/**
 * 
 * @param {number} hole 
 */
PlayerState.prototype.sowSeeds = function (hole) {
    console.log(hole);

    this.game.changeState(new WaitState(this.game, this.board));
}

PlayerState.prototype.run = function() {
    for(let i = 0; i < this.board.nHoles; i++) {
        document.getElementById(`hole0-${i}`).classList.add("player-hole");
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
function WaitState(game, board) {
    GameState.call(this, game, board);
}

WaitState.prototype = Object.create(GameState.prototype);
Object.defineProperty(WaitState.prototype, 'constructor', {
    value: WaitState,
    enumerable: false,
    writable: true
})

WaitState.prototype.run = function() {
    for(let i = 0; i < this.board.nHoles; i++) {
        document.getElementById(`hole0-${i}`).classList.remove("player-hole");
    }
}

/**
 * 
 * @param {GameState} state 
 */
function Game() {
    this.state;
}

/**
 * 
 * @param {GameState} state
 */
Game.prototype.changeState = function(state) {
    this.state = state;
    this.state.run();
}

Game.prototype.sowSeeds = function(hole) {
    this.state.sowSeeds(hole);
}


/**
 * 
 * @param {Board} board  
 */
function setupBoard(board) {
    const boardElement = document.getElementById("board");
    let nHoles = board.nHoles;

    document.querySelectorAll("div.seed-box")
        .forEach(el => {
            el.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;
        })
    boardElement.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;

    document.getElementById("board").innerHTML = null;

    [1, 0].forEach(el => {
        const seedCounterWrapper = document.getElementById(`seeds${el}`);
        seedCounterWrapper.innerHTML = "";

        for (let i = 0; i < nHoles; i++) {
            const seedCounter = document.createElement("span");
            seedCounter.className = "seed-num";
            seedCounter.id = `seeds${el}-${i}`;
            seedCounter.innerHTML = "0";
            seedCounterWrapper.appendChild(seedCounter);

            const seedHole = document.createElement("div");
            seedHole.className = `hole ${el == 0 ? " player-hole" : ""}`;
            seedHole.id = `hole${el}-${i}`;
            boardElement.appendChild(seedHole);
        }
    });
}

/**
 * 
 * @param {Board} board  
 */
function setupSeeds(board) {
    let nHoles = board.nHoles;

    [1, 0].forEach(el => {
        for (let i = 0; i < nHoles; i++) {
            const elem = document.getElementById(`hole${el}-${i}`);

            for (let j = 0; j < board.seeds[el][i]; j++) {
                const y = Math.random() * (70 - 8) + 8;
                const x = Math.random() * 60;
                const rot = Math.random() * 90;

                const newElem = document.createElement("div");
                newElem.id = `seed${el}-${i}-${j}`;
                newElem.className = "seed";
                newElem.style.left = x + "%";
                newElem.style.top = y + "%";
                newElem.style.transform = `rotate(${rot}deg)`;

                elem.appendChild(newElem);
            }
        }
    });
}

/**
 * 
 * @param {Game} board  
 */
function setupHoles() {
    document.querySelectorAll(".player-hole").forEach(hole => {
        hole.addEventListener('click', game.sowSeeds.bind(game, hole))
    })
}

function setupGame(nHoles, seedsPerHole, turn) {
    const board = new Board(nHoles, seedsPerHole);
    setupBoard(board);
    setupSeeds(board);

    let gameState;

    game = new Game();
    if(turn === 0) {
        gameState = new PlayerState(game, board);
    } else {
        gameState = new WaitState(game, board);
    }
    game.changeState(gameState);

    setupHoles();
}

let game;