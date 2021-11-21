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
    document.querySelectorAll("div.seed-box")
        .forEach(el => {
            el.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;
        })
    document.getElementById("board").style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;

    [1, 0].forEach(el => {
        let seedCounter = "";
        let seedHole = "";

        for (let i = 0; i < nHoles; i++) {
            seedCounter += `<span class="seed-num" id="seeds${el}-${i}">0</span>`;      
            seedHole += `<div class="hole ${el == 0 ? "player-hole" : ""}" id="hole${el}-${i}"></div>`
        }

        document.getElementById(`seeds${el}`).innerHTML = seedCounter;
        document.getElementById("board").innerHTML += seedHole;

    })
}

function main() {
    setupPopupWindows();
    setupBoard(6);
}

main();
