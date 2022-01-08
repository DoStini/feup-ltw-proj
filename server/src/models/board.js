'use strict';

class Board {
    /** @property {Array.<number>} storage */
    #storage = [0, 0];
    /** @property {number} nHoles */
    #nHoles;
    /** @property {number} nSeeds */
    #nSeeds;
    /** @property {Array.<number>} seeds */
    #seeds;

    constructor(nHoles, nSeeds, boardJSON) {
        this.#nHoles = nHoles;
        this.#nSeeds = nSeeds;
        if(boardJSON == null) {
            this.generateSeeds();
        } else {
            this.#JSONtoBoard(boardJSON);
        }
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
        this.#storage[playerID] += 1;
        this.#seeds[hole] -= 1;
    }

    moveToHole(fromHole, toHole) {
        this.#seeds[toHole] += 1;
        this.#seeds[fromHole] -= 1;
    }

    getHoleSeedAmount(hole) {
        return this.#seeds[hole];
    }

    getStorageAmount(playerID) {
        return this.#storage[playerID];
    }

    generateSeeds() {
        this.#seeds = Array(this.#nHoles * 2).fill(this.#nSeeds);
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

    toJSON() {
        return JSON.stringify({
            seeds: this.#seeds,
            storage: this.#storage,
            nHoles: this.#nHoles,
            nSeeds: this.#nSeeds
        })
    }

    #JSONtoBoard(json) {
        const obj = JSON.parse(json);

        this.#storage = obj.storage.map((val) => parseInt(val))
        this.#seeds = obj.seeds.map((val) => parseInt(val));
    }
}

module.exports = Board;
