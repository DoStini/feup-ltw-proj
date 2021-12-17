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

class GameState {
    /**
    * 
    * @param {Game} game
    * @param {Board} board 
    * @param {Player} player
    * @param {Player} otherPlayer
    */
    constructor(game, board, player, otherPlayer) {
        this.board = board;
        this.game = game;
        this.player = player;
        this.otherPlayer = otherPlayer;
    }
    /**
     *
     * @param {Game} game
     * @param {number} hole
     */
    sowSeeds(hole) {
        console.log(hole);
        let seeds = this.board.seeds[hole].length;
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = [];

        console.log(seeds);

        for (let i = 0; i < seeds; i++) {
            if (lastHole == this.player.id * this.board.nHoles + this.board.nHoles - 1) {
                this.board.storage[this.player.id].push(this.board.seeds[hole].pop());

                lastHole = this.board.nHoles * 2 + this.player.id;
                destHoles.push(lastHole);
            } else {
                curHole = (curHole + 1) % (this.board.nHoles * 2);
                this.board.seeds[curHole].push(this.board.seeds[hole].pop());

                destHoles.push(curHole);

                lastHole = curHole;
            }
        }

        console.log("dest holes ", destHoles);

        return destHoles;
    }

    clickHole(hole) {}
    run() { }
    nextState() { };
}


class PlayerState extends GameState {
    constructor(game, board, player, otherPlayer) {
        super(game, board, player, otherPlayer);
    }

    run() {
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");
        addMessage(MESSAGE.otherTurn(this.player.name));

        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.add("player-hole");
        }
    }

    clickHole(hole) {
        this.game.nextPlayerState(() => new WaitState(this.game, this.board, this.player, this.otherPlayer));

        let destHoles = this.sowSeeds(hole); /** @property {Array} destHoles */
        let lastHole = destHoles[destHoles.length - 1];

        if (lastHole == this.board.nHoles * 2 + this.player.id) {
            this.game.nextPlayerState(() => {
                return new AnimationState(this.game, this.board, this.player, this.otherPlayer, (game, board, player, otherPlayer) => new PlayerState(game, board, player, otherPlayer));
            });
        } else {
            this.game.nextPlayerState(() => {
                return new AnimationState(this.game, this.board, this.player, this.otherPlayer, (game, board, player, otherPlayer) => new PlayAIState(game, board, otherPlayer, player));
            });
        }

        animateSeeds(hole, this.board.nHoles, destHoles);
    }
}

class AnimationState extends GameState {
    constructor(game, board, player, otherPlayer, nextStateConstructor) {
        super(game, board, player, otherPlayer);
        this.nextStateConstructor = nextStateConstructor;
        this.callback = this.handleEvent.bind(this);

        window.addEventListener(ANIM_EVENT_NAME, this.callback);
        console.log("hello ", this.player, " is animating");
    }

    sowSeeds(hole) {

    }

    run() {
    }

    handleEvent() {
        console.log("hello ", this.player, " finished animating");

        this.game.nextPlayerState(() => {
            return this.nextStateConstructor(this.game, this.board, this.player, this.otherPlayer)
        });

        window.removeEventListener(ANIM_EVENT_NAME, this.callback);
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
class WaitState extends GameState {
    constructor(game, board, player, otherPlayer) {
        super(game, board, player, otherPlayer);
    }

    clickHole(hole) {

    }

    run() {
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }
    }
}

class PlayAIState extends GameState {
    constructor(game, board, player, otherPlayer) {
        super(game, board, player, otherPlayer);
    }

    run() {
        addMessage(MESSAGE.otherTurn(this.player.name));
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");

        setTimeout(function () {
            let hole = ((Math.random() * this.board.nHoles) >> 0) + this.board.nHoles;

            let destHoles = this.sowSeeds(hole); /** @property {Array} destHoles */
            let lastHole = destHoles[destHoles.length - 1];
    
            if (lastHole == this.board.nHoles * 2 + this.player.id) {
                this.game.nextPlayerState(() => {
                    return new AnimationState(this.game, this.board, this.player, this.otherPlayer, (game, board, player, otherPlayer) => new PlayAIState(game, board, player, otherPlayer));
                });
            } else {
                this.game.nextPlayerState(() => {
                    return new AnimationState(this.game, this.board, this.player, this.otherPlayer, (game, board, player, otherPlayer) => new PlayerState(game, board, otherPlayer, player));
                });
            }
    
            animateSeeds(hole, this.board.nHoles, destHoles);
        }.bind(this), 2000);
    }
}

class Game {
    constructor() {
        this.state;
    }
    /**
     *
     * @param {Player} player
     */

    nextPlayerState(stateFunc) {
        this.state = stateFunc();
        this.state.run();
    }

    changePlayerState(state) {
        this.state = state;
        this.state.run();
    }

    sowSeeds(hole) {
        this.state.clickHole(hole);
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
    const board = new Board(parseInt(nHoles), seedsPerHole);
    setupBoard(board);
    setupSeeds(board);

    const game = new Game();
    const player1 = new Player(0, "Player 1");
    const player2 = new Player(1, "AI");

    if (turn === 0) {
        game.changePlayerState(new PlayerState(game, board, player1, player2));
    } else {
        game.changePlayerState(new PlayAIState(game, board, player2, player1));
    }

    setupHoles(game);
}


async function animateSeeds(holeId, nHoles, idList) {
    const animationDuration = 2;
    const animationDelay = 0.1;
    const positionDuration = animationDuration - animationDelay;
    const dimensionDuration = (animationDuration - animationDelay) / 2;
    const animationInterval = 0.2;

    const boardOffset = nHoles * 2;

    const hole = document.getElementById(`hole-${holeId}`);
    const board = document.getElementById("board");
    const currentHole = parseInt(hole.id.split("-")[1]);

    const numSeeds = hole.children.length;

    Array.from(hole.children).reverse().forEach((seed, idx) => {
        setTimeout(() => {
            const currentHoleId = idList[idx];
            const isHole = currentHoleId < boardOffset;
            const nextHole = document.getElementById(isHole ? `hole-${currentHoleId}` : `storage-${currentHoleId - boardOffset}`);
            console.log("holeeee", isHole, currentHoleId, isHole ? `hole-${currentHoleId}` : `storage-${currentHoleId - boardOffset}`)
            const { left, top, height, width } = hole.getBoundingClientRect();
            const { left: leftLast, top: topLast, height: heightLast, width: widthLast } = nextHole.getBoundingClientRect();
            const fakeHole = hole.cloneNode();
            console.log("cont", leftLast, topLast, height, width);
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
                const fake = seed.cloneNode();
                fake.style.backgroundColor = "rgba(125,12,125,255)";
                nextHole.append(fake);
            })

            setTimeout(() => {
                nextHole.append(seed);
                fakeHole.remove();
            }, animationDuration * 1000);

        }, animationInterval * idx * 1000);
    });


    setTimeout(() => {
        console.log("dispatch")
        dispatchEvent(ANIM_EVENT);
    }, (animationDuration + animationInterval * numSeeds) * 1000);

}

