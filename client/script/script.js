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
        });
    });

    ["rules", "leaderboard", "end-game"].forEach((target) => {
        document.getElementById(`close-${target}`).addEventListener('click', () => {
            document.getElementById(target).style.opacity = null;
            document.getElementById(target).style.visibility = null;
        });
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".popup-window").forEach((target) => {
                target.style.opacity = null;
                target.style.visibility = null;
            })
        }
    });
}

function launchTieGame(points) {
    const target = document.getElementById("end-game");
    target.style.opacity = "1";
    target.style.visibility = "visible";

    ["win-icon", "lose-icon"].forEach((id) => {
        const target = document.getElementById(id);
        target.style.opacity = "";
        target.style.visibility = "";
    });

    const icon = document.getElementById("tie-icon");
    icon.style.opacity = "1";
    icon.style.visibility = "visible";

    const nameText = document.getElementById("end-player-name");
    nameText.innerText = "It was a Tie!";

    const pointsText = document.getElementById("end-player-points");
    pointsText.innerText = `Both players conquered ${points} points!`;

}

function launchEndGame(isWinner, name, points) {
    const target = document.getElementById("end-game");
    target.style.opacity = "1";
    target.style.visibility = "visible";

    const visibleIcon = document.getElementById(`${isWinner ? "win" : "lose"}-icon`);
    const invisibleIcon = document.getElementById(`${isWinner ? "lose" : "win"}-icon`);
    const tieIcon = document.getElementById("tie-icon");

    visibleIcon.style.opacity = "1";
    visibleIcon.style.visibility = "visible";

    [tieIcon, invisibleIcon].forEach((target) => {
        target.style.opacity = "";
        target.style.visibility = "";
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