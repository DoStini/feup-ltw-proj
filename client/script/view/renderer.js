'use strict';

class Renderer {
    render(obj) {

    }
}

class SeedRenderer extends Renderer {
    render(seed) {
        const newElem = document.createElement("div");
        newElem.id = `seed${seed.id}`;
        newElem.className = "seed";
        newElem.style.left = seed.x + "%";
        newElem.style.top = seed.y + "%";
        newElem.style.transform = `rotate(${seed.rot}deg)`;

        return newElem;
    }
}

class BoardRenderer extends Renderer {
    /** @property {Renderer} seedRenderer*/
    #seedRenderer;

    /**
     * 
     * @param {Renderer} seedRenderer 
     */
    constructor(seedRenderer) {
        super();

        if (seedRenderer == null) {
            this.#seedRenderer = new SeedRenderer();
        } else {
            this.#seedRenderer = seedRenderer;
        }
    }

    render(board) {
        const boardElement = document.getElementById("board");
        let nHoles = board.nHoles;

        document.querySelectorAll("div.seed-box")
            .forEach(el => {
                el.style['grid-template-columns'] = `repeat(${board.nHoles}, 1fr)`;
            });

        boardElement.style['grid-template-columns'] = `repeat(${board.nHoles}, 1fr)`;

        document.getElementById("board").innerHTML = null;

        [1, 0].forEach(el => {
            const seedCounterWrapper = document.getElementById(`seeds${el}`);
            seedCounterWrapper.innerHTML = "";
            document.getElementById(`storage-${el}`).innerHTML = "";

            for (let i = 0; i < board.nHoles; i++) {
                const idx = el === 0 ? i : board.nHoles * 2 - i - 1;
                const seedCounter = document.createElement("span");
                seedCounter.className = "seed-num";
                seedCounter.id = `seeds${idx}`;

                seedCounter.innerHTML = board.seeds[idx].length;
                seedCounterWrapper.appendChild(seedCounter);

                const seedHole = document.createElement("div");
                seedHole.className = `hole`;
                seedHole.id = `hole-${idx}`;
                boardElement.appendChild(seedHole);
                board.seeds[idx].forEach(seed => {
                    seedHole.appendChild(this.#seedRenderer.render(seed));
                });
            }
        });

        board.storage.forEach((store, idx) => {
            store.forEach(seed => {
                document.getElementById(`storage-${idx}`).appendChild(this.#seedRenderer.render(seed));
            })
        });

        return boardElement;
    }
}

class StatusRenderer extends Renderer {
    /**
     * @param {Game} game
     */
    render(game) {
        let status = document.getElementById("game-status");

        document.getElementById("status-turn").innerText = game.turn;

        document.getElementById("status-p0-store-seeds").innerText = game.board.storage[0].length;
        document.getElementById("status-p0").innerText = game.player1.name;
        document.getElementById("status-p1-store-seeds").innerText = game.board.storage[1].length;
        document.getElementById("status-p1").innerText = game.player2.name;

        let seeds0 = game.board.getSeedsInPlay(0);
        let seeds1 = game.board.getSeedsInPlay(1);

        document.getElementById("status-p0-play-seeds").innerText = seeds0;
        document.getElementById("status-p1-play-seeds").innerText = seeds1;

        let original = game.state.player;
        let score = evaluateBoard(game.state);
        game.state.player = game.state.otherPlayer;
        game.state.otherPlayer = original;

        let score1 = evaluateBoard(game.state);

        game.state.otherPlayer = game.state.player;
        game.state.player = original;

        if(game.currentPlayer.id === 0) {
            document.getElementById("status-p0-play-adv").innerText = score.toFixed(2);
            document.getElementById("status-p1-play-adv").innerText = score1.toFixed(2);
        }  else {
            document.getElementById("status-p0-play-adv").innerText = score1.toFixed(2);
            document.getElementById("status-p1-play-adv").innerText = score.toFixed(2);
        }

        document.getElementById("status-turn-name").innerText = game.currentPlayer ? game.currentPlayer.name : "?";

        return status;
    }
}
