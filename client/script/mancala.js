"use strict";

const ANIM_EVENT_NAME = "animation-end";
const ANIM_EVENT = new Event(ANIM_EVENT_NAME);

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
                seedCounter.id = `seeds${el}-${el === 0 ? i : this.nHoles - i - 1}`;
                console.log(idx, this.seeds)

                seedCounter.innerHTML = this.seeds[idx].length;
                seedCounterWrapper.appendChild(seedCounter);

                const seedHole = document.createElement("div");
                seedHole.className = `hole${el === 0 ? " player-hole" : ""}`;
                console.log(seedHole)
                seedHole.id = `hole${el}-${el === 0 ? i : this.nHoles - i - 1}`;
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
        animateSeeds(hole, this.player.id);
        this.game.nextPlayerState(this.player);
    }
    
    run() {
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");

        addMessage(MESSAGE.otherTurn(this.player.name));

        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole0-${i}`).classList.add("player-hole");
        }
    }

    nextState() {
        return new AnimationState(this.game, this.board, this.player, (game, board, player) => new WaitState(game, board, player));
    }
}

class AnimationState extends GameState {
    constructor(game, board, player, nextStateConstructor) {
        super(game, board, player);   
        this.nextStateConstructor = nextStateConstructor;
        this.callback = this.handleEvent.bind(this);
        
        window.addEventListener(ANIM_EVENT_NAME, this.callback);
        console.log("hello ", this.player, " is animating");
    }
    
    run() {
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole0-${i}`).classList.remove("player-hole");
        }
    }

    handleEvent() {
        console.log("hello ", this.player, " finished animating");
        this.game.nextStates(this.player);
        window.removeEventListener(ANIM_EVENT_NAME, this.callback);
    }

    nextState() {
        return this.nextStateConstructor(this.game, this.board, this.player);
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

    sowSeeds(hole) {
        console.log(hole);
        animateSeeds(hole, this.player.id);
        this.game.nextPlayerState(this.player);
    }

    run() {
        addMessage(MESSAGE.otherTurn(this.player.name));
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");

        setTimeout(function () {
            this.sowSeeds((Math.random() * this.board.nHoles) >> 0);
        }.bind(this), 2000);
    }

    nextState() {
        return new AnimationState(this.game, this.board, this.player, (game, board, player) => new WaitAIState(game, board, player));
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
        this.states = [];
    }
    /**
     *
     * @param {Player} player
     */

    nextPlayerState(player) {
        this.states[player.id] = this.states[player.id].nextState();
        this.states[player.id].run();
    }

    nextStates(player) {
        let otherPlayer = (player.id + 1) % 2

        this.states[player.id] = this.states[player.id].nextState();
        this.states[player.id].run();

        this.states[otherPlayer] = this.states[otherPlayer].nextState();
        this.states[otherPlayer].run();
    }

    changePlayerState(player, state) {
        this.states[player.id] = state;
        this.states[player.id].run();
    }

    sowSeeds(hole) {
        this.states[0].sowSeeds(hole);
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
    game.changePlayerState(player1, gameState);
    game.changePlayerState(player2, enemyState);

    setupHoles(game);
}


async function animateSeeds(holeId, el) {
    const animationDuration = 2;
    const animationDelay = 0.1;
    const positionDuration = animationDuration - animationDelay;
    const dimensionDuration = (animationDuration - animationDelay ) / 2;
    const animationInterval = 0.2;

    const hole = document.getElementById(`hole${el}-${holeId}`);
    const board = document.getElementById("board");
    const currentHole = parseInt(hole.id.split("-")[1]);

    const numSeeds = hole.children.length;

    Array.from(hole.children).reverse().forEach((seed, idx) => {
        setTimeout(() => {
            const nextHole = document.getElementById(`hole${el}-${currentHole + idx + 1}`);
            const {left, top, height, width} = hole.getBoundingClientRect();
            const {left: leftLast, topLast} = nextHole.getBoundingClientRect();
            const fakeHole = hole.cloneNode();
            
            fakeHole.id = `fake-hole-${idx}`;
            fakeHole.style.backgroundColor = "rgba(0,0,0,0)";
    
            fakeHole.style.position = "absolute";
            fakeHole.style.transition = `left ${positionDuration}s, top ${positionDuration}s, width ${dimensionDuration}s, height ${dimensionDuration}s`;
            fakeHole.style.left = `${left}px`;
            fakeHole.style.top = `${top}px`;
            fakeHole.style.width = `${width}px`;
            fakeHole.style.height = `${height}px`;
    
            fakeHole.append(seed);
            board.append(fakeHole);
    
            setTimeout(() => {
                fakeHole.style.left = `${leftLast}px`;
                fakeHole.style.top = `${topLast}px`;
                fakeHole.style.width = `${width + 100}px`;
                fakeHole.style.height = `${height + 100}px`;
            }, animationDelay * 1000);
    
            setTimeout(() => {
                fakeHole.style.width = `${width}px`;
                fakeHole.style.height = `${height}px`;
            }, (animationDelay + dimensionDuration) * 1000);
    
            setTimeout(() => {
                nextHole.append(seed);
                fakeHole.remove();
            }, animationDuration * 1000);
        }, animationInterval * idx * 1000);
    
    setTimeout(() => {
        console.log("dispatch")
        dispatchEvent(ANIM_EVENT);
    }, (animationDuration + animationInterval * numSeeds) * 1000);

    });
}

