'use strict';

class Board {
    /** @property {Array.<Array.<Seed>>} storage */
    #storage = [[],[]];
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
}
