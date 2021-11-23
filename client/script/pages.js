'use strict'

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

        bodyElement.style.display = "none";
        bodyElement.classList.toggle("show");

        let curPageCleanup = this.pageCleanup[this.curPage];
        if (typeof curPageCleanup === 'function') curPageCleanup();
    }

    element.style.display = null;
    element.classList.toggle("show");

    this.curPage = elementId;
}

function startGame(pageManager) {
    let holes = document.getElementById("holes").value;
    let seeds = document.getElementById("seeds").value;
    let turn = 0;

    if(document.getElementById("ai-order-ai").checked) {
        turn = 1;
    }

    setupGame(holes, seeds, turn);
    pageManager.setPage("game-section");
    document.getElementById("game-status").classList.remove("hidden");
}

function cleanupGame() {
    document.getElementById("game-status").classList.add("hidden");

    if(toggleGameStatus.open) {
        toggleGameStatus();
    }

    document.getElementById("message-board").innerText = "";
}

function startAuth(pageManager) {
    pageManager.setPage("auth");

    document.getElementById("log-in-header").style.visibility = "hidden";
    document.getElementById("log-in-header").style.display = "none";
}

function cleanupAuth() {
    document.getElementById("username-login").value = null;
    document.getElementById("username-register").value = null;
    document.getElementById("password-login").value = null;
    document.getElementById("password-register").value = null;
    document.getElementById("confirm-password").value = null;

    document.getElementById("log-in-header").style.visibility = null;
    document.getElementById("log-in-header").style.display = null;
}

function setupInitMenu(pageManager) {
    let setPageConfig = pageManager.setPage.bind(pageManager, "config");
    let setInitMenu = pageManager.setPage.bind(pageManager, "init-menu");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);
    document.getElementById("header-logo").addEventListener('click', setInitMenu);
    document.getElementById("log-in-header").addEventListener('click', () => startAuth(pageManager));

    pageManager.pageCleanup["auth"] = cleanupAuth;
}

function setupConfig(pageManager) {
    let startGameButton = document.getElementById("start-game-button");

    pageManager.pageCleanup["game-section"] = cleanupGame;
    startGameButton.addEventListener('click',  () => startGame(pageManager));
}

function setupPages() {
    document.querySelectorAll(".in-body").forEach(bodyElement => {
        bodyElement.style.display = "none";
    });

    const pageManager = new PageManager();

    setupInitMenu(pageManager);
    setupConfig(pageManager);

    pageManager.setPage("init-menu");
}
