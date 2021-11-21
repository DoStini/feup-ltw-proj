/**
 * 
 * @param {string} initPage 
 */
function PageManager(initPage) {
    this.pageCleanup = {};
    this.curPage = initPage;
}

/**
 * @param {string} elementId
 */
PageManager.prototype.setPage = function(elementId) {
    let element = document.getElementById(elementId);
    if (element === null) return;

    document.querySelectorAll(".in-body").forEach(bodyElement => {
        bodyElement.style.visibility = null;
        bodyElement.style.display = "none";
    });

    let curPageCleanup = this.pageCleanup[this.curPage];
    if(typeof curPageCleanup === 'function') curPageCleanup();

    element.style.visibility = "visible";
    element.style.display = null;

    this.curPage = elementId;
}

/**
 * 
 * @param {Object} f 
 */
function curry(f) {
    return function (a) {
        return function () {
            f(a);
        }
    }
}

function startGame() {
    let holes = document.getElementById("holes").value;

    setupBoard(holes);
    pageManager.setPage("game-section");
    document.getElementById("game-status").style.visibility = "visible";
}

function cleanupGame() {
    document.getElementById("game-status").style.visibility = null;
}

/**
 * 
 * @param {PageManager} pageManager 
 */
function setupInitMenu() {
    let setPageConfig = pageManager.setPage.bind(pageManager, "config");
    let setInitMenu = pageManager.setPage.bind(pageManager, "init-menu");
    let setAuthMenu = pageManager.setPage.bind(pageManager, "auth");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);
    document.getElementById("header-logo").addEventListener('click', setInitMenu);
    document.getElementById("log-in-header").addEventListener('click', setAuthMenu);
}

/**
 * 
 * @param {PageManager} pageManager 
 */
function setupConfig() {
    let startGameButton = document.getElementById("start-game-button");

    pageManager.pageCleanup["game-section"] = cleanupGame;
    startGameButton.addEventListener('click', startGame);
}

function setupPages() {
    setupInitMenu();
    setupConfig();

    pageManager.setPage("init-menu");
    console.log(pageManager);
}

let pageManager = new PageManager("init-menu");
