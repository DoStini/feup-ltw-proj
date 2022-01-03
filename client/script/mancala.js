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
    * @param {Player} player
    * @param {Player} otherPlayer
    */
    constructor(game, player, otherPlayer, animator) {
        this.board = game.board; /** @property {Board} board */
        this.game = game;
        this.player = player;
        this.otherPlayer = otherPlayer;
        if(!animator) {
            this.animator = new CSSAnimator();
        } else {
            this.animator = animator;
        }
    }

    /**
     * @param {number} hole
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    sowSeeds(hole) {
        let seeds = this.board.seeds[hole].length;
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = {};

        destHoles[hole] = [];

        for (let i = 0; i < seeds; i++) {
            if (lastHole === this.player.id * this.board.nHoles + this.board.nHoles - 1) {
                this.board.storage[this.player.id].push(this.board.seeds[hole].pop());

                lastHole = this.board.nHoles * 2 + this.player.id;
                destHoles[hole].push(lastHole);
            } else {
                curHole = (curHole + 1) % (this.board.nHoles * 2);
                this.board.seeds[curHole].push(this.board.seeds[hole].pop());

                destHoles[hole].push(curHole);

                lastHole = curHole;
            }
        }

        return destHoles;
    }

    /**
     * @param {number} hole
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    captureSeeds(lastHole) {
        let holeToHoles = {};

        if (this.game.holeBelongsToPlayer(lastHole, this.player) && this.board.seeds[lastHole].length === 1) {
            let storage = this.board.nHoles * 2 + this.player.id;
            let oppositeHole = this.board.nHoles * 2 - 1 - lastHole;
            let oppositeSeeds = this.board.seeds[oppositeHole].length;

            for (let i = 0; i < oppositeSeeds; i++) {
                this.board.storage[this.player.id].push(this.board.seeds[oppositeHole].pop())
            }
            this.board.storage[this.player.id].push(this.board.seeds[lastHole].pop());

            holeToHoles[lastHole] = [storage];
            holeToHoles[oppositeHole] = Array(oppositeSeeds).fill(storage);
        }

        return holeToHoles;
    }

    checkChain(lastHole) {
        return lastHole == this.board.nHoles * 2 + this.player.id;
    }

    checkEnd() {
        let avail = this.game.getAvailHoles(this.player);

        if (avail.length === 0) {
            return this.player.id;
        }

        avail = this.game.getAvailHoles(this.otherPlayer);
        
        if(avail.length === 0) {
            return this.otherPlayer.id;
        }

        return false;
    }

    /**
     * 
     * @param {Integer} hole
     * @returns {GameState}
     */
    async play(hole) {
        let holeToHoles = this.sowSeeds(hole); /** @property {Array} destHoles */
        let destHoles = holeToHoles[hole];
        let lastHole = destHoles[destHoles.length - 1];

        await this.animator.animateSeeds(hole, this.board.nHoles, destHoles);
        if (this.checkChain(lastHole)) {
            return this.getCurrentState.bind(this);
        }

        holeToHoles = this.captureSeeds(lastHole);

        let animations = [];
        for(let hole in holeToHoles) { 
            animations.push(this.animator.animateSeeds(hole, this.board.nHoles, holeToHoles[hole]));
        }

        await Promise.all(animations);

        return this.getNextState.bind(this);
    }

    clickHole(hole) { }
    run() { }
    getNextState() { };
    getCurrentState() { };
}

class PlayerState extends GameState {
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    getCurrentState() {
        return new PlayerState(this.game, this.player, this.otherPlayer, this.mInfo);
    }

    getNextState() {
        return new PlayAIState(this.game, this.otherPlayer, this.player, this.mInfo);
    }

    run() {
        this.game.nextTurn();
        this.game.renderAll();

        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");
        addMessage(MESSAGE.otherTurn(this.player.name));

        let endID = this.checkEnd();
        if(endID !== false) {
            this.game.endGame(endID);
        }
    }

    async clickHole(hole) {
        if (this.board.seeds[hole].length === 0) return;
        if (!(hole >= this.board.nHoles * this.player.id && hole < this.board.nHoles * (this.player.id + 1))) return;
        this.game.nextPlayerState(() => new WaitState(this.game, this.player, this.otherPlayer));
        
        this.game.nextPlayerState(await this.play(hole));
    }
}

class PlayAIState extends GameState {
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    getCurrentState() {
        return new PlayAIState(this.game, this.player, this.otherPlayer);
    }

    getNextState() {
        return new PlayerState(this.game, this.otherPlayer, this.player);
    }

    async run() {
        this.game.nextTurn();
        this.game.renderAll();

        addMessage(MESSAGE.otherTurn(this.player.name));
        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");

        let endID = this.checkEnd();
        if(endID !== false) {
            this.game.endGame(endID);
            return;
        }

        setTimeoutClearable(async function () {
            let avail = this.game.getAvailHoles(this.player);

            let hole = avail[(Math.random() * avail.length) >> 0];

            this.game.nextPlayerState(await this.play(hole));
        }.bind(this), 2000);
    }
}

class PlayMPState extends GameState {
    constructor(game, player, otherPlayer, mInfo) {
        super(game, player, otherPlayer);
        this.mInfo = mInfo;
    }

    getCurrentState() {
        return new PlayMPState(this.game, this.player, this.otherPlayer, this.mInfo);
    }

    getNextState() {
        return new WaitMPState(this.game, this.otherPlayer, this.player, this.mInfo);
    }

    async handleUpdate(e) {
        let data = JSON.parse(e.data);

        if(this.playedHole != null) {
            await this.play(this.playedHole);
        }

        if(data.winner) {
            let endID = this.checkEnd();
            if(endID !== false) {
                this.game.endGame(endID);
            }
        } else {
            if(data.board.turn === this.player.name) {
                this.game.nextPlayerState(this.getCurrentState.bind(this));
            } else {
                this.game.nextPlayerState(this.getNextState.bind(this));
            }
        }
    }

    run() {
        this.mInfo.evtSource.onmessage = (e) => this.handleUpdate.bind(this)(e);

        this.game.nextTurn();
        this.game.renderAll();

        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");
        addMessage(MESSAGE.otherTurn(this.player.name));
    }

    async clickHole(hole) {
        if (this.board.seeds[hole].length === 0) return;
        if (!(hole >= this.board.nHoles * this.player.id && hole < this.board.nHoles * (this.player.id + 1))) return;
        this.game.nextPlayerState(() => new WaitState(this.game, this.player, this.otherPlayer));
        this.playedHole = hole;

        const data = {
            nick: getUser(),
            password: getPass(),
            game: this.mInfo.gameHash,
            move: hole
        };

        let a = await postRequest(data, 'notify');
        
        if(a.status === 404) {
            console.log("lol fail: ", a);

            return;
        }
    }
}

class WaitMPState extends GameState {
    constructor(game, player, otherPlayer, mInfo) {
        super(game, player, otherPlayer);
        this.mInfo = mInfo;
    }

    /**
     * 
     * @param {Board} boardLeft 
     * @param {Array} boardRight 
     */
    compareBoards(boardLeft, boardRight) {
        for(let i = 0; i < boardLeft.nHoles * 2; i++) {
            if(boardLeft.seeds[i].length !== boardRight[i]) {
                return false;
            }
        }

        if(boardLeft.storage[0].length !== boardRight[boardLeft.nHoles * 2]) return false;
        if(boardLeft.storage[1].length !== boardRight[boardLeft.nHoles * 2 + 1] ) return false;

        return true;
    }

    getCurrentState() {
        return new WaitMPState(this.game, this.player, this.otherPlayer, this.mInfo);
    }

    getNextState() {
        return new PlayMPState(this.game, this.otherPlayer, this.player, this.mInfo);
    }

    async handleUpdate(e) {
        let data = JSON.parse(e.data);

        if(data.board) {
            let parsed = parseBoard(data);

            let hole = data.pit + this.player.id * this.board.nHoles;
            let nextState = await this.play(hole);

            this.game.nextPlayerState(nextState);
        }

        if(data.winner) {
            let endID = this.checkEnd();
            if(endID !== false) {
                this.game.endGame(endID);
            }

            return;
        }
    }

    run() {
        this.mInfo.evtSource.onmessage = (e) => this.handleUpdate.bind(this)(e);

        this.game.nextTurn();
        this.game.renderAll();

        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");
        addMessage(MESSAGE.otherTurn(this.player.name));
    }

    async clickHole(hole) {
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
 class WaitState extends GameState {
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    clickHole(hole) {

    }

    run() {
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
 class EndState extends GameState {
    constructor(game, player, otherPlayer, lastPlayerId) {
        super(game, player, otherPlayer);
        this.lastPlayerId = lastPlayerId;
    }

    clickHole(hole) {

    }

    calculateWinner() {
    }
    
    showWinner() {
        const score1 = this.game.player1Points();
        const score2 = this.game.player2Points();


        if (score1 === score2) {
            launchTieGame(score1);
        } else {
            const winner = score1 > score2
            ? {player: this.player, score: score1}
            : {player: this.otherPlayer, score: score2}
   
            launchEndGame(winner.player.id === 0, winner.player.name, winner.score);
        }
    }

    async run() {
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }

        let destHoles = this.game.collectAllSeeds(
            this.lastPlayerId === 0 
                ? this.otherPlayer
                : this.player);

        await Promise.all(Object.keys(destHoles).map(async function (origin) {
            let destinations = destHoles[origin];
            
            await this.animator.animateSeeds(origin, this.board.nHoles, destinations);
        }.bind(this)));

        this.game.renderAll();

        this.showWinner();
    }
}

class Game {
    /**
     * @param {Board} board
     * @param {Player} player1
     * @param {Player} player2
     * @param {Renderer} board
     * @param {Renderer} statusRenderer
     */
    constructor(board, player1, player2, boardRenderer, statusRenderer) {
        this.state;
        this.board = board;
        this.player1 = player1;
        this.player2 = player2;
        this.turn = 0;

        if (boardRenderer == null) {
            this.boardRenderer = new BoardRenderer();
        } else {
            this.boardRenderer = boardRenderer;
        }

        if (statusRenderer == null) {
            this.statusRenderer = new StatusRenderer();
        } else {
            this.statusRenderer = statusRenderer;
        }
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

    endGame(playerId) {
        this.state = new EndState(this, this.player1, this.player2, playerId);
        this.state.run();
    }

    player1Points() {
        return this.board.storage[0].length;
    }

    player2Points() {
        return this.board.storage[1].length;
    }

    nextTurn() {
        this.turn++;
    }

    /**
     * 
     * @param {Board} board  
     */
    renderAll() {
        this.boardRenderer.render(this.board);
        this.setupHoles();
        this.statusRenderer.render(this);
    }

    holeBelongsToPlayer(hole, player) {
        return hole >= this.board.nHoles * player.id && hole < this.board.nHoles * (player.id + 1);
    }

    getAvailHoles(player) {
        let avail = [];

        for (let i = this.board.nHoles * player.id; i < this.board.nHoles * (player.id + 1); i++) {
            if (this.board.seeds[i].length > 0) {
                avail.push(i);
            }
        }

        return avail;
    }

    collectAllSeeds(player) {
        let avail = this.getAvailHoles(player);
        let destHoles = {};
        avail.forEach((hole) => {
            let storage = this.board.nHoles * 2 + player.id;
            let seeds = this.board.seeds[hole].length;
            destHoles[hole] = Array(seeds).fill(storage);

            for(let i = 0; i < seeds; i++) {
                this.board.storage[player.id].push(this.board.seeds[hole].pop());
            }
        });

        return destHoles;
    }

    setupHoles() {
        let holes = document.querySelectorAll(".hole")

        holes.forEach(hole => {
            let curHole = parseInt(hole.id.split("-")[1]);
            hole.addEventListener('click', this.clickHole.bind(this, curHole))
        })

        if (this.state instanceof PlayerState || (this.state instanceof PlayMPState)) {
            holes.forEach(hole => {
                let curHole = parseInt(hole.id.split("-")[1]);

                if (this.holeBelongsToPlayer(curHole, this.state.player)) {
                    hole.classList.add("player-hole");
                }
            })
        }
    }

    async clickHole(hole) {
        await this.state.clickHole(hole);
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

class Animator {
    async animateSeeds(holeId, nHoles, idList) {

    };
}

class FakeAnimator extends Animator {
    async animateSeeds(holeId, nHoles, idList) {
        //
    }
}

class CSSAnimator extends Animator {
    async animateSeeds(holeId, nHoles, idList) {

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
            setTimeoutClearable(() => {
                const currentHoleId = idList[idx];
                const isHole = currentHoleId < boardOffset;
                const nextHole = document.getElementById(isHole ? `hole-${currentHoleId}` : `storage-${currentHoleId - boardOffset}`);
                const { left: targetLeft, top: targetTop } = calculateTargetPosition(seed, nextHole, board);
    
                const { left, top, height, width } = calculateInitialPosition(seed, hole);
    
                seed.remove();
    
                const fakeSeed = seed.cloneNode();
    
                board.appendChild(fakeSeed);
                fakeSeed.style.position = "fixed";
                fakeSeed.id = `fake-${seed.id}`;
                fakeSeed.style.left = `${left}px`;
                fakeSeed.style.top = `${top}px`;
                fakeSeed.style.zIndex = "5";
                fakeSeed.style.width = `${width}px`;
                fakeSeed.style.height = `${height}px`;
    
    
                setTimeoutClearable(() => {
                    fakeSeed.style.transition = `left ${positionDuration}s, top ${positionDuration}s, width ${dimensionDuration}s, height ${dimensionDuration}s`;
                    fakeSeed.style.left = `${targetLeft}px`;
                    fakeSeed.style.top = `${targetTop}px`;
                    fakeSeed.style.width = `${width + 30}px`;
                    fakeSeed.style.height = `${height + 30}px`;
    
                }, animationDelay * 1000);
    
                setTimeoutClearable(() => {
                    fakeSeed.style.width = `${width}px`;
                    fakeSeed.style.height = `${height}px`;
                }, (animationDelay + dimensionDuration) * 1000);
    
                setTimeoutClearable(() => {
                    fakeSeed.remove();
                    nextHole.append(seed);
                }, animationDuration * 1000);
    
            }, animationInterval * idx * 1000);
        });
    
    
        return new Promise(_ => setTimeoutClearable(_, (animationDuration + animationInterval * numSeeds) * 1000));
    }
}

