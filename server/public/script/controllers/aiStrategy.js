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
        let avail = gameState.game.board.getAvailHoles(gameState.player.id);

        let hole = avail[(Math.random() * avail.length) >> 0];

        return hole;
    }
}

class NegaMaxAIStrategy {
    /** @type {number} */
    #depth;
    /** @type {Function} */
    #evalFunc;

    /**
     * 
     * @param {number} depth 
     */
    constructor(depth) {
        this.#depth = depth;
        if(depth > 9) {
            this.#evalFunc = simpleEval;
        } else {
            this.#evalFunc = evaluateBoard;
        }
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
        if(gameState.checkEnd()) {
            depth = 0;

            gameState.game.collectAllSeeds();
        }

        if (depth <= 0) {
            return { maxScore: this.#evalFunc(gameState), maxHole: -1 };
        }

        const origSeeds = [...gameState.game.board.seeds];
        const origStorage = [...gameState.game.board.storage];

        let maxScore = Number.NEGATIVE_INFINITY;
        let maxHole = 0;
        const availHoles = gameState.game.board.getAvailHoles(curPlayerID);

        for (let h = 0; h < availHoles.length; h++) {
            const hole = availHoles[h];

            const destHoles = gameState.sowSeeds(hole, curPlayerID);
            const lastHole = destHoles[destHoles.length - 1];
            gameState.captureSeeds(lastHole, curPlayerID);
            let newGameState;
            if (gameState.checkChain(lastHole, curPlayerID)) {
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

            for(let i = 0; i < origSeeds.length; i++) {
                gameState.game.board.seeds[i] = origSeeds[i];
            } 
            for(let i = 0; i < origStorage.length; i++) {
                gameState.game.board.storage[i] = origStorage[i];
            }
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

        const origBoard = gameState.game.board;
        gameState.game.board = new NumberBoard(origBoard);

        let { maxScore, maxHole } = this.negamax(gameState, this.#depth, gameState.player.id, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

        gameState.game.board = origBoard

        return maxHole;
    }
}

function simpleEval(gameState) {
    let score = 0;
    let otherPlayer = (gameState.player.id + 1) % 2;

    score += (gameState.game.board.getStorageAmount(gameState.player.id) - gameState.game.board.getStorageAmount(otherPlayer));
    score += gameState.game.board.getSeedsInPlay(gameState.player.id) * (0.55 / (gameState.game.board.nHoles * gameState.game.board.nSeeds));

    return score;
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
    gameState.game.board = gameState.game.board.toNumberBoard();

    score += (gameState.game.board.getStorageAmount(gameState.player.id) - gameState.game.board.getStorageAmount(otherPlayer)) * 0.45;
    score += gameState.game.board.getSeedsInPlay(gameState.player.id) * (0.55 / (gameState.game.board.nHoles * gameState.game.board.nSeeds));

    const origSeeds = [...gameState.game.board.seeds]
    const origStorage = [...gameState.game.board.storage]

    for (let hole = 0; hole < gameState.game.board.nHoles * 2; hole++) {
        if (gameState.game.board.holeBelongsToPlayer(hole, gameState.player.id)) {
            curPlayer = gameState.player.id;
        } else {
            curPlayer = otherPlayer;
        }

        const destHoles = gameState.sowSeeds(hole, curPlayer);
        const lastHole = destHoles[destHoles.length - 1];
        const captured = gameState.captureSeeds(lastHole, curPlayer);
        const oppositeHole = gameState.game.board.getOppositeHole(lastHole);

        if(captured[oppositeHole] != null) {
            if (curPlayer === gameState.player.id) {
                score += captured[oppositeHole].length * 0.05;
            } else {
                score -= captured[oppositeHole].length * 0.1;
            }
        }

        if (curPlayer === gameState.player.id && gameState.checkChain(lastHole, curPlayer)) {
            score += 0.1;
        }

        for(let i = 0; i < origSeeds.length; i++) {
            gameState.game.board.seeds[i] = origSeeds[i];
        } 
        for(let i = 0; i < origStorage.length; i++) {
            gameState.game.board.storage[i] = origStorage[i];
        }
    }

    gameState.game.board = origBoard;

    return score;
}