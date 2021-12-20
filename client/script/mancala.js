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
        let seeds = this.board.seeds[hole].length;
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = [];

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
        console.log("hello?")
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.add("player-hole");
        }
    }

    async clickHole(hole) {
        if (this.board.seeds[hole].length === 0) return;
        this.game.nextPlayerState(() => new WaitState(this.game, this.board, this.player, this.otherPlayer));

        let destHoles = this.sowSeeds(hole); /** @property {Array} destHoles */
        let lastHole = destHoles[destHoles.length - 1];

        await animateSeeds(hole, this.board.nHoles, destHoles);
        console.log("finished");
        console.log(destHoles);
        if (lastHole == this.board.nHoles * 2 + this.player.id) {
            this.game.nextPlayerState(() => {
                return new PlayerState(this.game, this.board, this.player, this.otherPlayer);
            });
        } else {
            console.log(this.board.seeds[lastHole].length);
            if(lastHole >= this.board.nHoles * this.player.id && lastHole < this.board.nHoles * (this.player.id + 1) &&this.board.seeds[lastHole].length === 1) {
                let storage = this.board.nHoles * 2 + this.player.id;
                let oppositeHole = this.board.nHoles*2 - 1 - lastHole;
                let oppositeSeeds = this.board.seeds[oppositeHole].length;
                console.log("ceazy ");

                for(let i = 0; i < oppositeSeeds; i++) {
                    this.board.storage[this.player.id].push(this.board.seeds[oppositeHole].pop())
                }
                this.board.storage[this.player.id].push(this.board.seeds[lastHole].pop());

                console.log(oppositeHole, [storage], Array(oppositeSeeds).fill(storage), oppositeSeeds);

                await Promise.all([
                    animateSeeds(lastHole, this.board.nHoles, [storage]),
                    animateSeeds(oppositeHole, this.board.nHoles, Array(oppositeSeeds).fill(storage)),
                ], () => console.log("finish both"));
            }

            this.game.nextPlayerState(() => {
                return new PlayAIState(this.game, this.board, this.otherPlayer, this.player);
            });
        }
    }
}

class AnimationState extends GameState {
    constructor(game, board, player, otherPlayer, nextStateConstructor) {
        super(game, board, player, otherPlayer);
        this.nextStateConstructor = nextStateConstructor;
        this.callback = this.handleEvent.bind(this);

        window.addEventListener(ANIM_EVENT_NAME, this.callback);
    }

    sowSeeds(hole) {

    }

    run() {
    }

    handleEvent() {
        // this.board.render();
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

    async run() {
        addMessage(MESSAGE.otherTurn(this.player.name));
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");

        setTimeout(async function () {
            let avail = [];

            for(let i = this.board.nHoles * this.player.id; i < this.board.nHoles * (this.player.id + 1); i++) {
                if(this.board.seeds[i].length > 0) {
                    avail.push(i);
                }
            }

            if(avail.length === 0) {
                return;
            }
            let hole = avail[(Math.random() * avail.length) >> 0];

            let destHoles = this.sowSeeds(hole); /** @property {Array} destHoles */
            let lastHole = destHoles[destHoles.length - 1];

            await animateSeeds(hole, this.board.nHoles, destHoles);
            console.log("finished");
            console.log(destHoles, lastHole);
            if (lastHole == this.board.nHoles * 2 + this.player.id) {
                this.game.nextPlayerState(() => {
                    return new PlayAIState(this.game, this.board, this.player, this.otherPlayer);
                });
            } else {
                if(lastHole >= this.board.nHoles * this.player.id && lastHole < this.board.nHoles * (this.player.id + 1) && this.board.seeds[lastHole].length === 1) {
                    let storage = this.board.nHoles * 2 + this.player.id;
                    let oppositeHole = this.board.nHoles*2 - 1 - lastHole;
                    let oppositeSeeds = this.board.seeds[oppositeHole].length;
                    console.log("ceazy ");
    
                    for(let i = 0; i < oppositeSeeds; i++) {
                        this.board.storage[this.player.id].push(this.board.seeds[oppositeHole].pop())
                    }
                    this.board.storage[this.player.id].push(this.board.seeds[lastHole].pop());
    
                    console.log(oppositeHole, [storage], Array(oppositeSeeds).fill(storage), oppositeSeeds);
    
                    await Promise.all([
                        animateSeeds(lastHole, this.board.nHoles, [storage]),
                        animateSeeds(oppositeHole, this.board.nHoles, Array(oppositeSeeds).fill(storage)),
                    ], () => console.log("finish both"));
    
                    /// TODO:: HOW TO WAIT UNTIL BOTH ANIMS END?
                }
    
                this.game.nextPlayerState(() => {
                    return new PlayerState(this.game, this.board, this.otherPlayer, this.player);
                });
            }
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

    async sowSeeds(hole) {
        await this.state.clickHole(hole);
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


function calculateTargetPosition(seed, hole) {
    const copySeed = seed.cloneNode();
    copySeed.style.transform = "";
    copySeed.id = `copy-${seed.id}`;

    hole.append(copySeed);
    const { left, top } = copySeed.getBoundingClientRect();

    copySeed.remove();

    return {
        left,
        top,
    }
}

function calculateInitialPosition(seed, hole) {
    const copySeed = seed.cloneNode();
    copySeed.style.transform = "";
    copySeed.id = `copy-${seed.id}`;

    hole.append(copySeed);
    const rect = copySeed.getBoundingClientRect();

    copySeed.remove();

    return rect;
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

    const numSeeds = hole.children.length;

    Array.from(hole.children).reverse().forEach((seed, idx) => {
        setTimeout(() => {
            const currentHoleId = idList[idx];
            const isHole = currentHoleId < boardOffset;
            const nextHole = document.getElementById(isHole ? `hole-${currentHoleId}` : `storage-${currentHoleId - boardOffset}`);
            const {left: targetLeft, top: targetTop} = calculateTargetPosition(seed, nextHole, board);

            const { left, top, height, width } = calculateInitialPosition(seed, hole);

            seed.remove();

            const fakeSeed = seed.cloneNode();

            board.appendChild(fakeSeed);
            fakeSeed.style.position = "fixed";
            fakeSeed.id = `fake-${seed.id}`;
            fakeSeed.style.left = `${left}px`;
            fakeSeed.style.top = `${top}px`;
            fakeSeed.style.zIndex = "1000000000";
            fakeSeed.style.width = `${width}px`;
            fakeSeed.style.height = `${height}px`;


            setTimeout(() => {
                fakeSeed.style.transition = `left ${positionDuration}s, top ${positionDuration}s, width ${dimensionDuration}s, height ${dimensionDuration}s`;
                fakeSeed.style.left = `${targetLeft}px`;
                fakeSeed.style.top = `${targetTop}px`;
                fakeSeed.style.width = `${width + 30}px`;
                fakeSeed.style.height = `${height + 30}px`;
                
            }, animationDelay * 1000);

            setTimeout(() => {
                fakeSeed.style.width = `${width}px`;
                fakeSeed.style.height = `${height}px`;
            }, (animationDelay + dimensionDuration) * 1000);

            setTimeout(() => {
                fakeSeed.remove();
                nextHole.append(seed);
            }, animationDuration * 1000);

        }, animationInterval * idx * 1000);
    });


    return new Promise(_ => setTimeout(_ , (animationDuration + animationInterval * numSeeds) * 1000));

}

