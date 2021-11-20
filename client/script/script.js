function setupPopupWindows() {

    ["rules", "leaderboard"].forEach((target) => {
        document.getElementById(`${target}-open-btn`).addEventListener('click', () => {
            console.log("click" + target);
            document.getElementById(target).style.opacity = "1";
            document.getElementById(target).style.visibility = "visible";
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


function main() {
    setupPopupWindows();
}

main();
