
/**
 * @param {string} elementId
 */
 function setPage(elementId) {
    let element = document.getElementById(elementId);
    if(element === null) return;

    document.querySelectorAll(".in-body").forEach(bodyElement => {
        bodyElement.style.visibility = null;
        bodyElement.style.display = "none";
    });

    document.getElementById("game-status").style.visibility = null;
    element.style.visibility = "visible";
    element.style.display = null;
}

/**
 * 
 * @param {Object} f 
 */
function curry(f) {
    return function(a) {
        return function() {
            f(a);
        }
    }
}

function setupInitMenu() {
    let setPageConfig = curry(setPage)("config");
    let setInitMenu = curry(setPage)("init-menu");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);
    document.getElementById("header-logo").addEventListener('click', setInitMenu);
}

function startGame() {
    let holes = document.getElementById("holes").value;
    
    setupBoard(holes);
    setPage("game-section");
    document.getElementById("game-status").style.visibility = "visible";
}

function setupConfig() {
    let startGameButton = document.getElementById("start-game-button");

    startGameButton.addEventListener('click', startGame);
}

function setupPages() {
    setupInitMenu();
    setupConfig();
}