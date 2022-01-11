'use strict';

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

    for (let i = 0; i < Math.min(10, leaderboard.length); i++) {
        const entry = leaderboard.at(i);
        tableBody.append(htmlEntry(entry, i + 1));
    }
}

function setupPopupWindows() {
    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            let targetElement = document.getElementById(target);

            if(targetElement.classList.toggle("visible")) {
                if (target === "leaderboard")
                    leaderboardHandler();
            }
            targetElement.classList.toggle("hidden");
        });
    });

    ["rules", "leaderboard", "end-game"].forEach((target) => {
        document.getElementById(`close-${target}`).addEventListener('click', () => {
            let targetElement = document.getElementById(target);

            targetElement.classList.remove("visible");
            targetElement.classList.add("hidden");
        });
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".popup-window").forEach((target) => {
                target.classList.add("hidden");
                target.classList.remove("visible");
            })
        }
    });
}

function launchTieGame(points) {
    const target = document.getElementById("end-game");
    target.classList.remove("hidden");
    target.classList.add("show");
    target.classList.add("visible");

    ["win-icon", "lose-icon"].forEach((id) => {
        const target = document.getElementById(id);

        target.classList.add("hidden");
        target.classList.remove("visible");
    });

    const icon = document.getElementById("tie-icon");
    icon.classList.add("visible");
    icon.classList.remove("hidden");

    const nameText = document.getElementById("end-player-name");
    nameText.innerText = "It was a Tie!";

    const pointsText = document.getElementById("end-player-points");
    pointsText.innerText = `Both players conquered ${points} points!`;

}

function launchEndGame(isWinner, name, points) {
    const target = document.getElementById("end-game");
    target.classList.remove("hidden");
    target.classList.add("show");
    target.classList.add("visible");

    const visibleIcon = document.getElementById(`${isWinner ? "win" : "lose"}-icon`);
    const invisibleIcon = document.getElementById(`${isWinner ? "lose" : "win"}-icon`);
    const tieIcon = document.getElementById("tie-icon");

    visibleIcon.classList.add("visible");
    visibleIcon.classList.remove("hidden");

    [tieIcon, invisibleIcon].forEach((target) => {
        target.classList.add("hidden");
        target.classList.remove("visible");
    })

    const nameText = document.getElementById("end-player-name");
    nameText.innerText = `${name} won the game!`;

    const pointsText = document.getElementById("end-player-points");
    pointsText.innerText = `The winner conquered ${points} points!`;
}

function toggleGameStatus() {
    if (typeof toggleGameStatus.open === 'undefined') {
        toggleGameStatus.open = true;
    }

    if (toggleGameStatus.open === true) {
        document.getElementById("game-status").style.right = (-document.getElementById("game-status-info").offsetWidth).toString() + "px";
        document.getElementById("game-status-button").style.transform = "scaleX(-1)"
    } else if (toggleGameStatus.open === false) {
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