function setupPopupWindows() {
    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            console.log("click" + target);
            let targetElement = document.getElementById(target);

            if (targetElement.style.opacity === "1") {
                targetElement.style.opacity = "0";
            } else {
                targetElement.style.opacity = "1";
            }

            if (targetElement.style.visibility === "visible") {
                targetElement.style.visibility = null;
            } else {
                targetElement.style.visibility = "visible";
            }
        })

        document.getElementById(`close-${target}`).addEventListener('click', () => {
            console.log("click close" + target);
            document.getElementById(target).style.opacity = null;
            document.getElementById(target).style.visibility = null;
        })
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            console.log(document.getElementsByClassName("popup-window"))
            document.querySelectorAll(".popup-window").forEach((target) => {
                target.style.opacity = null;
                target.style.visibility = null;
            })
        }
    });
}

function toggleGameStatus() {
    toggleGameStatus.open = !toggleGameStatus.open || false;

    if(toggleGameStatus.open === false) {
        document.getElementById("game-status").style.right = (-document.getElementById("game-status-info").offsetWidth).toString() + "px";
    } else {
        document.getElementById("game-status").style.right = "0";
    }

}

function setupGameStatus() {
    let buttonElement = document.getElementById("game-status-button");

    buttonElement.onclick = toggleGameStatus;
    toggleGameStatus();
}


function main() {
    setupPopupWindows();
    setupGameStatus();
}

main();
