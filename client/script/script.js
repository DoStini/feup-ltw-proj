function setupPopupWindows() {

    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            console.log("click" + target);
            document.getElementById(target).style.opacity = "1";
            document.getElementById(target).style.visibility = "visible";
        })

        document.getElementById(`close-${target}`).addEventListener('click', () => {
            console.log("click close" + target);
            document.getElementById(target).style.opacity = "0";
            document.getElementById(target).style.visibility = "hidden";
        })
    })
}


function main() {
    setupPopupWindows();
}

main();
