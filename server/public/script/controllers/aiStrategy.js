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
    negamax(gameState, depth, curPlayerID, alpha, beta) {
        if (depth <= 0 || gameState.checkEnd()) {
            return { maxScore: evaluateBoard(gameState), maxHole: -1 };
        }

        const origSeeds = [...gameState.board.seeds];
        const origStorage = [...gameState.board.storage];

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
            
            let score;
            if(gameState.player.id !== newGameState.player.id) {
                score = -this.negamax(newGameState, depth - 1, newGameState.player.id, -beta, -alpha).maxScore;
            } else {
                score = this.negamax(newGameState, depth - 1, newGameState.player.id, alpha, beta).maxScore;
            }

            if (score > maxScore) {
                maxScore = score;
                maxHole = hole;
            }
            alpha = Math.max(alpha, maxScore);

            if(alpha >= beta) {
                return { maxScore, maxHole };
            }

            gameState.board.seeds = [...origSeeds]
            gameState.board.storage = [...origStorage]
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

        const origBoard = gameState.board;
        gameState.game.board = new NumberBoard(origBoard);

        let { maxScore, maxHole } = this.negamax(gameState, this.#depth, gameState.player.id, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

        gameState.game.board = origBoard

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

    const origBoard = gameState.game.board;
    gameState.game.board = new NumberBoard(origBoard);

    score += (gameState.board.getStorageAmount(gameState.player.id) - gameState.board.getStorageAmount(otherPlayer)) * 0.45;
    score += gameState.board.getSeedsInPlay(gameState.player.id) * (0.55 / (gameState.board.nHoles * gameState.board.nSeeds));
    

    const origSeeds = [...gameState.game.board.seeds]
    const origStorage = [...gameState.game.board.storage]

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

        gameState.game.board.seeds = [...origSeeds]
        gameState.game.board.storage = [...origStorage]
    }

    gameState.game.board = origBoard;

    return score;
}