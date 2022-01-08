class AIStrategyFactory {
    /**
     * 
     * @param {string} aiDifficulty 
     * 
     * @returns {AIStrategy}
     */
    createStrategy(aiDifficulty) {
        const [name, depth] = aiDifficulty.split("-");

        switch (name) {
            case "nega":
                return new NegaMaxAIStrategy(depth);
                break;
            case "random":
            default:
                return new RandomAIStrategy();
                break;

        }
    }
}

class AIStrategy {
    /**
     * 
     * @param {Game} game 
     * @param {number} playerID 
     * 
     * @returns {number} The hole chosen to play.
     */
    move(game, playerID) {

    }
}

class RandomAIStrategy {
    /**
     * 
     * @param {GameState} gameState
     * 
     * @returns {number} The hole chosen to play.
     */
    move(gameState) {
        let avail = gameState.board.getAvailHoles(gameState.player.id);

        let hole = avail[(Math.random() * avail.length) >> 0];

        return hole;
    }
}

class NegaMaxAIStrategy {
    /** @type {number} */
    #depth;

    /**
     * 
     * @param {number} depth 
     */
    constructor(depth) {
        this.#depth = depth;
    }

    /**
     * 
     * @param {GameState} gameState 
     * @param {number} depth
     * @param {number} playerID
     * 
     * @returns {{maxScore: number, maxHole: number}}
     */
    negamax(gameState, depth, curPlayerID) {
        if (depth <= 0 || gameState.checkEnd()) {
            return { maxScore: evaluateBoard(gameState), maxHole: -1 };
        }

        const origSeeds = JSON.parse(JSON.stringify(gameState.board.seeds));
        const origStorage = JSON.parse(JSON.stringify(gameState.board.storage));

        let maxScore = Number.NEGATIVE_INFINITY;
        let maxHole = 0;
        const availHoles = gameState.board.getAvailHoles(curPlayerID);

        for (let h = 0; h < availHoles.length; h++) {
            const hole = availHoles[h];

            const result = gameState.sowAndCapture(hole, curPlayerID);
            let newGameState;
            if (result.chain) {
                newGameState = gameState;
            } else {
                newGameState = gameState.getNextState();
            }
            
            let { maxScore: score } = this.negamax(newGameState, depth - 1, newGameState.player.id);
            if(gameState.player.id !== newGameState.player.id) {
                score = -score;
            }

            if (score > maxScore) {
                maxScore = score;
                maxHole = hole;
            }

            gameState.board.seeds = JSON.parse(JSON.stringify(origSeeds));
            gameState.board.storage = JSON.parse(JSON.stringify(origStorage));
        }

        return { maxScore, maxHole };
    }

    /**
     * 
     * @param {GameState} gameState
     * 
     * @returns {number} The hole chosen to play.
     */
    move(gameState) {

        const origSeeds = gameState.board.seeds;
        const origStorage = gameState.board.storage;
        gameState.board.seeds = JSON.parse(JSON.stringify(gameState.board.seeds));
        gameState.board.storage = JSON.parse(JSON.stringify(gameState.board.storage));

        let { maxScore, maxHole } = this.negamax(gameState, this.#depth, gameState.player.id);
        console.log(maxHole);
        console.log(maxScore);

        gameState.board.seeds = origSeeds;
        gameState.board.storage = origStorage;

        return maxHole;
    }
}

/**
 * 
 * @param {GameState} gameState 
 * 
 * @returns {number} The board score
 */
function evaluateBoard(gameState) {
    let score = 0;
    let otherPlayer = (gameState.player.id + 1) % 2;
    let curPlayer;

    score += (gameState.board.getStorageAmount(gameState.player.id) - gameState.board.getStorageAmount(otherPlayer)) * 0.45;
    const origSeeds = gameState.board.seeds;
    const origStorage = gameState.board.storage;

    score += gameState.board.getSeedsInPlay(gameState.player.id) * (0.55 / (gameState.board.nHoles * gameState.board.nSeeds));
    gameState.board.seeds = JSON.parse(JSON.stringify(gameState.board.seeds));
    gameState.board.storage = JSON.parse(JSON.stringify(gameState.board.storage));

    for (let hole = 0; hole < gameState.board.nHoles * 2; hole++) {
        if (gameState.board.holeBelongsToPlayer(hole, gameState.player.id)) {
            curPlayer = gameState.player.id;
        } else {
            curPlayer = otherPlayer;
        }

        const holeToHoles = gameState.sowSeeds(hole, curPlayer);
        const destHoles = holeToHoles[hole];
        const lastHole = destHoles[destHoles.length - 1];
        const captured = gameState.captureSeeds(lastHole, curPlayer);

        for (let key in captured) {
            if (curPlayer === gameState.player.id) {
                score += captured[key].length * 0.05;
            } else {
                score -= captured[key].length * 0.1;
            }
        }

        if (curPlayer === gameState.player.id && gameState.checkChain(lastHole, curPlayer)) {
            score += 0.1;
        }

        gameState.board.seeds = JSON.parse(JSON.stringify(origSeeds));
        gameState.board.storage = JSON.parse(JSON.stringify(origStorage));

    }

    gameState.board.seeds = origSeeds;
    gameState.board.storage = origStorage;


    return score;
}