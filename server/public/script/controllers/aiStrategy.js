class AIStrategyFactory {
    /**
     * 
     * @param {string} aiDifficulty 
     * 
     * @returns {AIStrategy}
     */
    createStrategy(aiDifficulty) {
        const [name, depth] = aiDifficulty.split("-");

        switch(name) {
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
     * 
     * @returns {number} The board score
     */
    evaluateBoard(gameState) {
        let score = 0;
        let otherPlayer = (gameState.player.id + 1) % 2;
        let curPlayer;

        score += (gameState.board.getStorageAmount(gameState.player.id) - gameState.board.getStorageAmount(otherPlayer)) * 0.45;
        const origSeeds = gameState.board.seeds;
        const origStorage = gameState.board.storage;
        gameState.board.seeds = JSON.parse(JSON.stringify(gameState.board.seeds));
        gameState.board.storage = JSON.parse(JSON.stringify(gameState.board.storage));

        for(let hole = 0; hole < gameState.board.nHoles * 2; hole++) {
            if(gameState.board.holeBelongsToPlayer(hole, gameState.player.id)) {
                curPlayer = gameState.player.id;
            } else {
                curPlayer = otherPlayer;
            }
                
            const holeToHoles = gameState.sowSeeds(hole, curPlayer);
            const destHoles = holeToHoles[hole];
            const lastHole = destHoles[destHoles.length - 1];
            const captured = gameState.captureSeeds(lastHole, curPlayer);

            for(let key in captured) {
                if(curPlayer === gameState.player.id) {
                    score += captured[key].length * 0.05;
                } else {
                    score -= captured[key].length * 0.1;
                }
            }

            if(curPlayer === gameState.player.id && gameState.checkChain(lastHole, curPlayer)) {
                score += 0.1;
            }
            
            gameState.board.seeds = JSON.parse(JSON.stringify(origSeeds));
            gameState.board.storage = JSON.parse(JSON.stringify(origStorage));

        }

        gameState.board.seeds = origSeeds;
        gameState.board.storage = origStorage;


        return score;
    }

    /**
     * 
     * @param {GameState} gameState
     * 
     * @returns {number} The hole chosen to play.
     */
     move(gameState) {
        console.log(this.evaluateBoard(gameState));
        let avail = gameState.board.getAvailHoles(gameState.player.id);

        let hole = avail[(Math.random() * avail.length) >> 0];
        
        return hole;
    }
}