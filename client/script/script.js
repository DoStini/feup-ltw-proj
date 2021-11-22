function setupPopupWindows() {

    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            let targetElement = document.getElementById(target);

            if(targetElement.style.opacity === "1") {
                targetElement.style.opacity = "0";
            } else {
                targetElement.style.opacity = "1";
            }

            if(targetElement.style.visibility === "visible") {
                targetElement.style.visibility = null;
            } else {
                targetElement.style.visibility = "visible";
            }
        })

        document.getElementById(`close-${target}`).addEventListener('click', () => {
            document.getElementById(target).style.opacity = null;
            document.getElementById(target).style.visibility = null;
        })
    })

    document.addEventListener('keydown', (e) => {
        if(e.key === "Escape") {
            document.querySelectorAll(".popup-window").forEach((target) => {
                target.style.opacity = null;
                target.style.visibility = null;
            })
        }
    });

}

function setupBoard(nHoles) {
    const board = document.getElementById("board");

    document.querySelectorAll("div.seed-box")
        .forEach(el => {
            el.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;
        })
    board.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;

    [1, 0].forEach(el => {
        const seedCounterWrapper = document.getElementById(`seeds${el}`);
        seedCounterWrapper.innerHTML = "";

        for (let i = 0; i < nHoles; i++) {
            const seedCounter = document.createElement("span");
            seedCounter.className = "seed-num";
            seedCounter.id = `seeds${el}-${i}`;
            seedCounter.innerHTML = "0";
            seedCounterWrapper.appendChild(seedCounter);

            const seedHole = document.createElement("div");
            seedHole.className = `hole ${el == 0 ? " player-hole" : ""}`;
            seedHole.id = `hole${el}-${i}`;
            board.appendChild(seedHole);
        }
    });
}

function setupSeeds(nHoles, seedsPerHole) {

    [1, 0].forEach(el => {
        for (let i = 0; i < nHoles; i++) {
            const elem = document.getElementById(`hole${el}-${i}`);
            
            for (let j = 0; j < seedsPerHole; j++) {
                const [x, y] = [0, 0].map(() => Math.random() * 60 +  5);
                const rot = Math.random() * 90;
                const newElem = document.createElement("div");
                newElem.id = `seed${el}-${i}-${j}`;
                newElem.className = "seed";
                newElem.style.left = x + "%";
                newElem.style.top = y + "%";
                newElem.style.transform = `rotate(${rot}deg)`;

                elem.appendChild(newElem);
            }
        }
    });
}

function setupGame(nHoles, seedsPerHole) {
    setupBoard(nHoles);
    setupSeeds(nHoles, seedsPerHole);
}

function main() {
    setupPopupWindows();
    setupGame(6, 4);
}

main();
