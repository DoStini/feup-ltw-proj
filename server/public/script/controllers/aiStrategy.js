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
     * @param {Game} game 
     * @param {number} playerID 
     * 
     * @returns {number} The hole chosen to play.
     */
    move(game, playerID) {
        let avail = game.board.getAvailHoles(playerID);

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
     * @param {Game} game 
     * @param {number} playerID 
     * 
     * @returns {number} The hole chosen to play.
     */
     move(game, playerID) {
        return 0;
    }
}