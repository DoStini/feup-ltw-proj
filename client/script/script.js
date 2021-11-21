function setupPopupWindows() {

    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            console.log("click" + target);
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
            console.log("click close" + target);
            document.getElementById(target).style.opacity = null;
            document.getElementById(target).style.visibility = null;
        })
    })

    document.addEventListener('keydown', (e) => {
        if(e.key === "Escape") {
            console.log(document.getElementsByClassName("popup-window"))
            document.querySelectorAll(".popup-window").forEach((target) => {
                target.style.opacity = null;
                target.style.visibility = null;
            })
        }
    });

}

function setupBoard(nHoles) {
    console.log(document.querySelectorAll("div.seed-box"))
    document.querySelectorAll("div.seed-box")
        .forEach(el => {
            el.style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;
        })
    document.querySelector("div.game-area > div#board").style['grid-template-columns'] = `repeat(${nHoles}, 1fr)`;

    [1, 0].forEach(el => {
        let seedCounter = "";
        let seedHole = "";

        for (let i = 0; i < nHoles; i++) {
            seedCounter += `<span class="seed-num" id="seeds${el}-${i}">0</span>`;      
            seedHole += `<div class="hole ${el == 0 ? "player-hole" : ""}" id="hole%{el}-${i}"></div>`
        }

        document.getElementById(`seeds${el}`).innerHTML = seedCounter;
        document.getElementById("board").innerHTML += seedHole;

    })

    document.querySelector("#seeds1")

}

function main() {
    setupPopupWindows();
    setupBoard(6);
}

main();
