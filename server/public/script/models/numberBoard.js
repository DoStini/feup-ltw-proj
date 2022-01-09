class NumberBoard extends Board {
    /**
     * 
     * @param {*} nHoles 
     * @param {*} nSeeds 
     * @param {Board} board 
     */
    constructor(board) {
        super(board.nHoles, board.nSeeds, true);
        this.storage = [board.getStorageAmount(0), board.getStorageAmount(1)];
        this.seeds = [];
        for(let i = 0; i < board.nHoles * 2; i++) {
            this.seeds[i] = board.getHoleSeedAmount(i);
        }
    }

    moveToStorage(hole, playerID) {
        this.storage[playerID] += 1;
        this.seeds[hole] -= 1;
    }

    moveToHole(fromHole, toHole) {
        this.seeds[toHole] += 1;
        this.seeds[fromHole] -= 1;
    }

    getHoleSeedAmount(hole) {
        return this.seeds[hole];
    }

    getStorageAmount(playerID) {
        return this.storage[playerID];
    }
}
