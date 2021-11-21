/**
 * 
 * @param {string} initPage 
 */
function PageManager() {
    this.pageCleanup = {};
}

/**
 * @param {string} elementId
 */
PageManager.prototype.setPage = function (elementId) {
    let element = document.getElementById(elementId);
    if (element === null) return;

    if (typeof this.curPage !== 'undefined') {
        let bodyElement = document.getElementById(this.curPage);

        bodyElement.classList.toggle("hidden");

        let curPageCleanup = this.pageCleanup[this.curPage];
        if (typeof curPageCleanup === 'function') curPageCleanup();
    }

    element.classList.toggle("hidden");

    this.curPage = elementId;
}

function startGame() {
    let holes = document.getElementById("holes").value;

    setupBoard(holes);
    pageManager.setPage("game-section");
    document.getElementById("game-status").classList.remove("hidden");
}

function cleanupGame() {
    document.getElementById("game-status").classList.add("hidden");
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
}

let pageManager = new PageManager();
