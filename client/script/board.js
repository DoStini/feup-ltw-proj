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

    render() {
        const boardElement = document.getElementById("board");
        let nHoles = this.nHoles;

        document.querySelectorAll("div.seed-box")
            .forEach(el => {
                el.style['grid-template-columns'] = `repeat(${this.nHoles}, 1fr)`;
            });

        boardElement.style['grid-template-columns'] = `repeat(${this.nHoles}, 1fr)`;

        document.getElementById("board").innerHTML = null;

        // this.storage.forEach((store, idx) => {
        //     store.forEach(seed => {
        //         seed.render(document.getElementById(`storage-${idx}`));
        //     })
        // });

        [1, 0].forEach(el => {
            const seedCounterWrapper = document.getElementById(`seeds${el}`);
            seedCounterWrapper.innerHTML = "";

            for (let i = 0; i < this.nHoles; i++) {
                const idx = i + el * this.nHoles;
                const seedCounter = document.createElement("span");
                seedCounter.className = "seed-num";
                seedCounter.id = `seeds${el === 0 ? i : this.nHoles * 2 - i - 1}`;

                seedCounter.innerHTML = this.seeds[idx].length;
                seedCounterWrapper.appendChild(seedCounter);

                const seedHole = document.createElement("div");
                seedHole.className = `hole${el === 0 ? " player-hole" : ""}`;
                seedHole.id = `hole-${el === 0 ? i : this.nHoles * 2 - i - 1}`;
                boardElement.appendChild(seedHole);
                this.seeds[idx].forEach(seed => {
                    seed.render(seedHole);
                });
            }
        });
    }

    selectSeeds(player, hole) {

    }
}
