class GameState {
    /** @property {Game} game */
    game;
    /** @property {Player} player */
    player;
    /** @property {Player} otherPlayer */
    otherPlayer;
    /** @property {Animator} animator */
    animator;

    /**
    * 
    * @param {Game} game
    * @param {Player} player
    * @param {Player} otherPlayer
    * @param {Animator} animator
    */
    constructor(game, player, otherPlayer, animator) {
        this.game = game;
        this.player = player;
        this.otherPlayer = otherPlayer;
        if (!animator) {
            this.animator = new HTMLAnimator();
        } else {
            this.animator = animator;
        }
    }

    /**
     * @param {number} hole
     * 
     * @returns {Array.<number>}
     */
    sowSeeds(hole, playerID) {
        let seeds = this.game.board.getHoleSeedAmount(hole);
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = new Array(seeds);

        for (let i = 0; i < seeds; i++) {
            if (lastHole === this.game.board.getLastHole(playerID)) {
                this.game.board.moveToStorage(hole, playerID);

                lastHole = this.game.board.getStorageID(playerID);
                destHoles[i] = lastHole;
            } else {
                curHole = this.game.board.getNextHole(curHole);
                this.game.board.moveToHole(hole, curHole);

                destHoles[i] = curHole;
                lastHole = curHole;
            }
        }

        return destHoles;
    }

    /**
     * @param {number} lastHole
     * @param {number} playerID
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    captureSeeds(lastHole, playerID) {
        let holeToHoles = {};

        if (this.game.board.holeBelongsToPlayer(lastHole, playerID) && this.game.board.getHoleSeedAmount(lastHole) === 1) {
            let storage = this.game.board.getStorageID(playerID);
            let oppositeHole = this.game.board.getOppositeHole(lastHole);
            let oppositeSeeds = this.game.board.getHoleSeedAmount(oppositeHole);

            for (let i = 0; i < oppositeSeeds; i++) {
                this.game.board.moveToStorage(oppositeHole, playerID);
            }
            this.game.board.moveToStorage(lastHole, playerID);

            holeToHoles[lastHole] = [storage];
            holeToHoles[oppositeHole] = Array(oppositeSeeds).fill(storage);
        }

        return holeToHoles;
    }

    /**
     * Checks if player can play again.
     * 
     * @param {number} lastHole The hole where the last seed was placed
     * @param {number} playerID The current player.
     * 
     * @returns {boolean}
     */
    checkChain(lastHole, playerID) {
        return lastHole === this.game.board.getStorageID(playerID);
    }

    /**
     * Checks if the game has ended.
     * 
     * @returns {boolean} true if game ended, or false if game didn't end.
     */
    checkEnd() {
        for (let playerID = 0; playerID <= 1; playerID++) {
            const avail = this.game.board.getAvailHoles(playerID);

            if (avail.length === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sows and if possible captures given the played hole.
     * 
     * @param {number} hole 
     * @returns {{chain: boolean, animation: SeedAnimation}}
     */
    sowAndCapture(hole, playerID) {
        const seedAnimation = new SeedAnimation();

        const destHoles = this.sowSeeds(hole, playerID);
        const lastHole = destHoles[destHoles.length - 1];
        const holeToHoles = {}
        holeToHoles[hole] = destHoles;

        seedAnimation.addStep(holeToHoles);
        seedAnimation.addStep(this.captureSeeds(lastHole, playerID));

        return { chain: this.checkChain(lastHole, playerID), animation: seedAnimation };
    }

    /**
     * Plays a turn given a hole.
     * 
     * @param {number} hole
     * @returns {Promise<GameState>} The next game state.
     */
    async play(hole) {
        const response = this.sowAndCapture(hole, this.player.id);

        await this.animator.executeAnimation(this.game.board.nHoles, response.animation);

        if (response.chain) {
            return this.getCurrentState();
        }
        return this.getNextState();
    }

    /**
     * Starts a turn, and sends a message.
     */
    startTurn() {
        this.game.nextTurn();
        this.game.renderAll();

        document.getElementById(`name${this.player.id}`).classList.add("player-turn");
        document.getElementById(`name${this.otherPlayer.id}`).classList.remove("player-turn");
        addMessage(MESSAGE.otherTurn(this.player.name));
    }

    /**
     * Handles clicking a hole
     * 
     * @param {number} hole 
     */
    clickHole(hole) { }

    /**
     * Executes at the end of a state change.
     */
    run() { }

    /**
     * Gets the next player turn state.
     * 
     * @returns {GameState} The next state.
     */
    getNextState() { };

    /**
     * Gets the current player turn state.
     * 
     * @returns {GameState} The current state.
     */
    getCurrentState() { return this; };
}

class PlayerState extends GameState {
    constructor(game, player, otherPlayer, animator) {
        super(game, player, otherPlayer, animator);
    }

    getNextState() {
        return new PlayAIState(this.game, this.otherPlayer, this.player, this.animator);
    }

    run() {
        this.startTurn();

        if (this.checkEnd()) {
            this.game.endGame();
        }
    }

    async clickHole(hole) {
        if (this.game.board.getHoleSeedAmount(hole) === 0) return;
        if (!this.game.board.holeBelongsToPlayer(hole, this.player.id)) return;

        this.game.changePlayerState(new WaitState(this.game, this.player, this.otherPlayer, this.animator));

        this.game.changePlayerState(await this.play(hole));
    }
}

class PlayAIState extends GameState {
    constructor(game, player, otherPlayer, animator) {
        super(game, player, otherPlayer, animator);
    }

    getNextState() {
        return new PlayerState(this.game, this.otherPlayer, this.player, this.animator);
    }

    async run() {
        this.startTurn();

        if (this.checkEnd()) {
            this.game.endGame();
            return;
        }

        setTimeoutClearable(async function () {
            let hole = this.game.aiStrategy.move(this);

            this.game.changePlayerState(await this.play(hole));
        }.bind(this), 500);
    }
}

class MPGameState extends GameState {
    /** @property {MultiplayerInfo} mInfo */
    mInfo;
    runningEvent = new Promise((res, rej) => res());

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @param {Player} otherPlayer 
     * @param {MultiplayerInfo} mInfo 
     */
    constructor(game, player, otherPlayer, mInfo, animator) {
        super(game, player, otherPlayer, animator);
        this.mInfo = mInfo;
    }

    changeStateOrEnd(data) {
        if (data.winner !== undefined) {
            this.mInfo.evtSource.close();

            if (data.winner === null) {
                this.game.endMPGame(null);
            } else if (data.winner === this.player.name) {
                this.game.endMPGame(this.player);
            } else {
                this.game.endMPGame(this.otherPlayer);
            }
        } else {
            if (data.board.turn === this.player.name) {
                this.game.changePlayerState(this.getCurrentState());
            } else {
                this.game.changePlayerState(this.getNextState());
            }
        }
    }

    /**
     * Handles an update response.
     * 
     * @param {MessageEvent<any>} e
     */
    async handleUpdate(e) {

        let data = JSON.parse(e.data);

        if (data.board) {
            let parsed = parseBoard(data);

            let hole = this.game.board.getRealHole(data.pit, this.player.id);
            await this.play(hole);

            if (!this.game.board.compareBoards(parsed.board)) {
                this.game.board.regenerateBoard(parsed.board);
            }
        }

        this.changeStateOrEnd(data);
    }

    run() {
        this.mInfo.evtSource.onmessage = (async (e) => {
            let run = this.runningEvent; // CURRENTLY RUNNING EVENT
            let resolve;

            this.runningEvent = new Promise((res, rej) => resolve = res); // SET RUNNING EVENT TO THIS EVENT
            await run; // WAIT FOR CURRENT EVENT TO FINISH
            await this.handleUpdate(e);
            resolve(); // EVENT FINISHED
        }).bind(this);

        this.startTurn();
    }
}

class PlayMPState extends MPGameState {
    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @param {Player} otherPlayer 
     * @param {MultiplayerInfo} mInfo 
     */
    constructor(game, player, otherPlayer, mInfo, animator) {
        super(game, player, otherPlayer, mInfo, animator);
    }

    getNextState() {
        return new WaitMPState(this.game, this.otherPlayer, this.player, this.mInfo);
    }

    async clickHole(hole) {
        if (this.game.board.getHoleSeedAmount(hole) === 0) return;
        if (!this.game.board.holeBelongsToPlayer(hole, this.player.id)) return;
        this.game.changePlayerState(new WaitState(this.game, this.player, this.otherPlayer, this.animator));

        const data = {
            nick: getUser(),
            password: getPass(),
            game: this.mInfo.gameHash,
            move: hole
        };

        let a = await postRequest(data, 'notify');

        if (a.status !== 200) {
            console.log("lol fail: ", a);

            return;
        }
    }
}

class WaitMPState extends MPGameState {
    constructor(game, player, otherPlayer, mInfo, animator) {
        super(game, player, otherPlayer, mInfo, animator);
    }

    getNextState() {
        return new PlayMPState(this.game, this.otherPlayer, this.player, this.mInfo);
    }
}

/**
 * 
 * @param {Game} game
 * @param {Board} board 
 */
class WaitState extends GameState {
    constructor(game, player, otherPlayer, animator) {
        super(game, player, otherPlayer, animator);
    }

    clickHole(hole) {

    }

    run() {
        for (let i = 0; i < this.game.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }
    }
}

class EndState extends GameState {
    /** @property {Player} winner */
    winner;

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @param {Player} otherPlayer 
     * @param {Player} winner 
     */
    constructor(game, player, otherPlayer, winner, animator) {
        super(game, player, otherPlayer, animator);
        this.winner = winner;
    }

    showWinner() {
        const score1 = this.game.board.getStorageAmount(this.player.id);
        const score2 = this.game.board.getStorageAmount(this.otherPlayer.id);

        if (this.winner === null) {
            launchTieGame(score1);
            return;
        }

        if (this.winner != null) {
            launchEndGame(this.winner.id === 0, this.winner.name, this.winner.id === 0 ? score1 : score2);
            return;
        }

        this.winner = score1 > score2 ? this.player : this.otherPlayer;

        if (score1 === score2) {
            launchTieGame(score1);
        } else {
            launchEndGame(this.winner.id === 0, this.winner.name, this.winner.id === 0 ? score1 : score2);
        }
    }

    async run() {
        for (let i = 0; i < this.game.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }

        let destHoles = this.game.collectAllSeeds();

        let animation = new SeedAnimation();
        animation.addStep(destHoles);
        await this.animator.executeAnimation(this.game.board.nHoles, animation);

        this.game.renderAll();
        this.showWinner();
    }
}
