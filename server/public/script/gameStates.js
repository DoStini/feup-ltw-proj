class GameState {
    /** @type {Board} board */
    board;
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
        this.board = game.board;
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
     * @returns {Object.<number, Array.<number>>}
     */
    sowSeeds(hole) {
        let seeds = this.board.getHoleSeedAmount(hole);
        let lastHole = hole
        let curHole = lastHole;
        let destHoles = {};

        destHoles[hole] = [];

        for (let i = 0; i < seeds; i++) {
            if (lastHole === this.board.getLastHole(this.player.id)) {
                this.board.moveToStorage(hole, this.player.id);

                lastHole = this.board.getStorageID(this.player.id);
                destHoles[hole].push(lastHole);
            } else {
                curHole = this.board.getNextHole(curHole);
                this.board.moveToHole(hole, curHole);

                destHoles[hole].push(curHole);
                lastHole = curHole;
            }
        }

        return destHoles;
    }

    /**
     * @param {number} lastHole
     * 
     * @returns {Object.<number, Array.<number>>}
     */
    captureSeeds(lastHole) {
        let holeToHoles = {};

        if (this.board.holeBelongsToPlayer(lastHole, this.player.id) && this.board.getHoleSeedAmount(lastHole) === 1) {
            let storage = this.board.getStorageID(this.player.id);
            let oppositeHole = this.board.getOppositeHole(lastHole);
            let oppositeSeeds = this.board.getHoleSeedAmount(oppositeHole);

            for (let i = 0; i < oppositeSeeds; i++) {
                this.board.moveToStorage(oppositeHole, this.player.id);
            }
            this.board.moveToStorage(lastHole, this.player.id);

            holeToHoles[lastHole] = [storage];
            holeToHoles[oppositeHole] = Array(oppositeSeeds).fill(storage);
        }

        return holeToHoles;
    }

    /**
     * Checks if player can play again.
     * 
     * @param {number} lastHole The hole where the last seed was placed
     * @returns {boolean}
     */
    checkChain(lastHole) {
        return lastHole === this.board.getStorageID(this.player.id);
    }

    /**
     * Checks if the game has ended.
     * 
     * @returns {boolean} true if game ended, or false if game didn't end.
     */
    checkEnd() {
        for (let playerID = 0; playerID <= 1; playerID++) {
            const avail = this.board.getAvailHoles(playerID);

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
    sowAndCapture(hole) {
        const seedAnimation = new SeedAnimation();

        const holeToHoles = this.sowSeeds(hole);
        const destHoles = holeToHoles[hole];
        const lastHole = destHoles[destHoles.length - 1];

        seedAnimation.addStep(holeToHoles);
        seedAnimation.addStep(this.captureSeeds(lastHole));

        return { chain: this.checkChain(lastHole), animation: seedAnimation };
    }

    /**
     * Plays a turn given a hole.
     * 
     * @param {number} hole
     * @returns {Promise<GameState>} The next game state.
     */
    async play(hole) {
        const response = this.sowAndCapture(hole);

        await this.animator.executeAnimation(this.board.nHoles, response.animation);

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
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    getNextState() {
        return new PlayAIState(this.game, this.otherPlayer, this.player);
    }

    run() {
        this.startTurn();

        if (this.checkEnd()) {
            this.game.endGame();
        }
    }

    async clickHole(hole) {
        if (this.board.getHoleSeedAmount(hole) === 0) return;
        if (!this.board.holeBelongsToPlayer(hole, this.player.id)) return;

        this.game.changePlayerState(new WaitState(this.game, this.player, this.otherPlayer));

        this.game.changePlayerState(await this.play(hole));
    }
}

class PlayAIState extends GameState {
    constructor(game, player, otherPlayer) {
        super(game, player, otherPlayer);
    }

    getNextState() {
        return new PlayerState(this.game, this.otherPlayer, this.player);
    }

    async run() {
        this.startTurn();

        if (this.checkEnd()) {
            this.game.endGame();
            return;
        }

        setTimeoutClearable(async function () {
            let avail = this.board.getAvailHoles(this.player.id);

            let hole = avail[(Math.random() * avail.length) >> 0];

            this.game.changePlayerState(await this.play(hole));
        }.bind(this), 2000);
    }
}

class MPGameState extends GameState {
    /** @property {MultiplayerInfo} mInfo */
    mInfo;

    /**
     * 
     * @param {Game} game 
     * @param {Player} player 
     * @param {Player} otherPlayer 
     * @param {MultiplayerInfo} mInfo 
     */
    constructor(game, player, otherPlayer, mInfo) {
        super(game, player, otherPlayer);
        this.mInfo = mInfo;
    }

    /**
     * Handles an update response.
     * 
     * @param {MessageEvent<any>} e
     */
    handleUpdate(e) {

    };

    changeStateOrEnd(data) {
        if (data.winner !== undefined) {
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

    async handleUpdate(e) {
        let data = JSON.parse(e.data);

        if (data.board) {
            let parsed = parseBoard(data);

            let hole = this.board.getRealHole(data.pit, this.player.id);
            await this.play(hole);

            if (!this.board.compareBoards(parsed.board)) {
                this.board.regenerateBoard(parsed.board);
            }
        }

        this.changeStateOrEnd(data);
    }

    run() {
        this.mInfo.evtSource.onmessage = this.handleUpdate.bind(this);

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
    constructor(game, player, otherPlayer, mInfo) {
        super(game, player, otherPlayer, mInfo);
    }

    getNextState() {
        return new WaitMPState(this.game, this.otherPlayer, this.player, this.mInfo);
    }

    async clickHole(hole) {
        if (this.board.getHoleSeedAmount(hole) === 0) return;
        if (!this.board.holeBelongsToPlayer(hole, this.player.id)) return;
        this.game.changePlayerState(new WaitState(this.game, this.player, this.otherPlayer));

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
    constructor(game, player, otherPlayer, mInfo) {
        super(game, player, otherPlayer, mInfo);
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
    constructor(game, player, otherPlayer, winner) {
        super(game, player, otherPlayer);
        this.winner = winner;
    }

    showWinner() {
        const score1 = this.board.getStorageAmount(this.player.id);
        const score2 = this.board.getStorageAmount(this.otherPlayer.id);

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
        for (let i = 0; i < this.board.nHoles; i++) {
            document.getElementById(`hole-${i}`).classList.remove("player-hole");
        }

        let destHoles = this.game.collectAllSeeds();

        let animation = new SeedAnimation();
        animation.addStep(destHoles);
        await this.animator.executeAnimation(this.board.nHoles, animation);

        this.game.renderAll();
        this.showWinner();
    }
}
