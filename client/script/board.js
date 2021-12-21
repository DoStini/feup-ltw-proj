'use strict';

class Board {
    constructor(nHoles, nSeeds) {
        this.storage = [[], []];
        this.nHoles = nHoles;
        this.nSeeds = nSeeds;
        this.generateSeeds();
    }

    generateSeeds() {
        const container = [];

        for (let h = 0; h < this.nHoles * 2; h++) {
            container.push([]);
            for (let s = 0; s < this.nSeeds; s++) {
                container[h][s] = new Seed(h * this.nSeeds + s);
            }
        }

        this.seeds = container;
    }
}
