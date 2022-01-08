'use strict';

class Board {
    /** @property {Array.<Array.<Seed>>} storage */
    #storage = [[], []];
    /** @property {number} nHoles */
    #nHoles;
    /** @property {number} nSeeds */
    #nSeeds;
    /** @property {Array.<Array.<Seed>>} seeds */
    #seeds;

    constructor(nHoles, nSeeds) {
        this.#nHoles = nHoles;
        this.#nSeeds = nSeeds;
        this.generateSeeds();
    }

    get nHoles() {
        return this.#nHoles;
    }

    get nSeeds() {
        return this.#nSeeds;
    }

    get seeds() {
        return this.#seeds;
    }

    set seeds(seeds) {
        this.#seeds = seeds;
    }


    set storage(storage) {
        this.#storage = storage;
    }

    get storage() {
        return this.#storage;
    }

    moveToStorage(hole, playerID) {
        this.#storage[playerID].push(this.#seeds[hole].pop());
    }

    moveToHole(fromHole, toHole) {
        this.#seeds[toHole].push(this.#seeds[fromHole].pop());
    }

    getHoleSeedAmount(hole) {
        return this.#seeds[hole].length;
    }

    getStorageAmount(playerID) {
        return this.#storage[playerID].length;
    }

    getSeedsInPlay(playerID) {
        let start = playerID * this.#nHoles;
        let total = 0;

        for (let hole = start; hole < start + this.#nHoles; hole++) {
            total += this.getHoleSeedAmount(hole);
        }

        return total;
    }

    generateSeeds() {
        const container = [];

        for (let h = 0; h < this.#nHoles * 2; h++) {
            container.push([]);
            for (let s = 0; s < this.#nSeeds; s++) {
                container[h][s] = new Seed(h * this.#nSeeds + s);
            }
        }

        this.#seeds = container;
    }

    holeBelongsToPlayer(hole, playerID) {
        return hole >= this.#nHoles * playerID && hole < this.#nHoles * (playerID + 1);
    }

    getRealHole(hole, playerID) {
        return hole + playerID * this.#nHoles;
    }

    getLastHole(playerID) {
        return playerID * this.#nHoles + this.#nHoles - 1;
    }

    getNextHole(hole) {
        return (hole + 1) % (this.#nHoles * 2);
    }

    getOppositeHole(hole) {
        return this.#nHoles * 2 - 1 - hole;
    }

    getStorageID(playerID) {
        return this.#nHoles * 2 + playerID;
    }

    getAvailHoles(playerID) {
        let avail = [];

        for (let hole = this.#nHoles * playerID; hole < this.#nHoles * (playerID + 1); hole++) {
            if (this.getHoleSeedAmount(hole) > 0) {
                avail.push(hole);
            }
        }

        return avail;
    }

    /**
     * Compares the board to an array of seed amounts per hole.
     * 
     * @param {Array} seeds 
     */
    compareBoards(seeds) {
        for (let hole = 0; hole < this.#nHoles * 2; hole++) {
            if (this.getHoleSeedAmount(hole) !== seeds[hole]) {
                return false;
            }
        }

        if (this.getStorageAmount(0) !== seeds[this.#nHoles * 2]) return false;
        if (this.getStorageAmount(1) !== seeds[this.#nHoles * 2 + 1]) return false;

        return true;
    }

    regenerateBoard(seeds) {
        const container = [];
        let id = 0;

        for (let h = 0; h < this.#nHoles * 2; h++) {
            container.push([]);
            for (let s = 0; s < seeds[h]; s++) {
                container[h][s] = new Seed(id);

                id++;
            }
        }

        this.#seeds = container;
        const storageStart = this.#nHoles * 2;
        this.#storage = [[],[]];

        for (let playerID = 0; playerID <= 1; playerID++) {
            let storageID = storageStart + playerID;
            for (let s = 0; s < seeds[storageID]; s++) {
                this.#storage[playerID].push(new Seed(id));

                id++;
            }
        }
    }
}
