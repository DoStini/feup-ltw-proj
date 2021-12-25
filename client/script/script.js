'use strict'

async function leaderboardHandler() {
    let leaderboard = await retrieveLeaderboard();

    const htmlEntry = (entry, position) => {
        
        const elem = document.createElement('tr');
        elem.innerHTML = `
                <td>${position}</td>
                <td class="name-row">${entry.nick}</td>
                <td>${entry.games}</td>
                <td>${entry.victories}</td>
            `;
        
        return elem;
    }

    const tableBody = document.querySelectorAll(".server-leaderboard .leaderboard-table > tbody")[0];
    tableBody.innerHTML = "";

    for (let i = 0; i < Math.min(5, leaderboard.length - 1); i++) {
        const entry = leaderboard.at(i);
        tableBody.append(htmlEntry(entry, i + 1));
    }
}

function setupPopupWindows() {
    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            let targetElement = document.getElementById(target);

            if (targetElement.style.opacity === "1") {
                targetElement.style.opacity = "0";
            } else {
                targetElement.style.opacity = "1";
                if (target === "leaderboard")
                    leaderboardHandler();
            }

            if (targetElement.style.visibility === "visible") {
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

function toggleGameStatus() {
    if( typeof toggleGameStatus.open === 'undefined') {
        toggleGameStatus.open = true;
    }

    if(toggleGameStatus.open === true) {
        document.getElementById("game-status").style.right = (-document.getElementById("game-status-info").offsetWidth).toString() + "px";
        document.getElementById("game-status-button").style.transform = "scaleX(-1)"
    } else if(toggleGameStatus.open === false) {
        document.getElementById("game-status").style.right = "0";
        document.getElementById("game-status-button").style.transform = ""
    }

    toggleGameStatus.open = !toggleGameStatus.open;
}

function setupGameStatus() {
    let buttonElement = document.getElementById("game-status-button");

    buttonElement.onclick = toggleGameStatus;
    document.getElementById("game-status").style.transition = "0s";
    toggleGameStatus();
    document.getElementById("game-status").style.transition = "";
}

async function changeHole(evt, el) {
    const animationDuration = 2;
    const animationDelay = 0.1;
    const positionDuration = animationDuration - animationDelay;
    const dimensionDuration = (animationDuration - animationDelay ) / 2;
    const animationInterval = 0.2;

    const hole = evt.target;
    const board = document.getElementById("board");
    const currentHole = parseInt(hole.id.split("-")[1]);
    
    Array.from(hole.children).reverse().forEach((seed, idx) => {
        setTimeout(() => {
            const nextHole = document.getElementById(`hole${el}-${currentHole + idx + 1}`);
            const {left, top, height, width} = hole.getBoundingClientRect();
            const {left: leftLast, topLast} = nextHole.getBoundingClientRect();
            const fakeHole = hole.cloneNode();
            
            fakeHole.id = `fake-hole-${idx}`;
            fakeHole.style.backgroundColor = "rgba(0,0,0,0)";
    
            fakeHole.style.position = "absolute";
            fakeHole.style.transition = `left ${positionDuration}s, top ${positionDuration}s, width ${dimensionDuration}s, height ${dimensionDuration}s`;
            fakeHole.style.left = `${left}px`;
            fakeHole.style.top = `${top}px`;
            fakeHole.style.width = `${width}px`;
            fakeHole.style.height = `${height}px`;
    
            fakeHole.append(seed);
            board.append(fakeHole);
    
            setTimeout(() => {
                fakeHole.style.left = `${leftLast}px`;
                fakeHole.style.top = `${topLast}px`;
                fakeHole.style.width = `${width + 100}px`;
                fakeHole.style.height = `${height + 100}px`;
            }, animationDelay * 1000);
    
            setTimeout(() => {
                fakeHole.style.width = `${width}px`;
                fakeHole.style.height = `${height}px`;
            }, (animationDelay + dimensionDuration) * 1000);
    
            setTimeout(() => {
                nextHole.append(seed);
                fakeHole.remove();
            }, animationDuration * 1000);
        }, animationInterval * idx * 1000);
    });
}

function setupBoard(nHoles) {
    const board = document.getElementById("board");

    document.querySelectorAll("div.seed-box")
        .forEach(el => {
            el.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;
        })
    board.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;

    document.getElementById("board").innerHTML = null;

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
            
            if (el == 0) {
                seedHole.className = "hole player-hole";
                seedHole.addEventListener("click", (e) => changeHole(e, el));
            } else {
                seedHole.className = "hole";
            }
            
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
                const y = Math.random() * (70-8) + 8;
                const x = Math.random() * 60;
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
    setupPages();
    
    window.addEventListener('load', setupGameStatus);
}

function setup() {
    setupAuth();
    main();
}

setup();