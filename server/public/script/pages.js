'use strict';

const pageManager = new PageManager();
let clicker;

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

        bodyElement.classList.remove("visible");
        bodyElement.classList.add("hidden");
        bodyElement.classList.remove("show");

        let curPageCleanup = this.pageCleanup[this.curPage];
        if (typeof curPageCleanup === 'function') curPageCleanup();
    }

    element.classList.add("visible");
    element.classList.remove("hidden");
    element.classList.add("show");

    this.curPage = elementId;

    updateAuthButtons();
}

function startGame(pageManager) {
    let holes = parseInt(document.getElementById("holes").value);
    let seeds = parseInt(document.getElementById("seeds").value);
    let aiDifficulty = document.getElementById("ai_difficulty").value;
    let name = document.getElementById("name").value;
    let turn = 0;

    if (document.getElementById("ai-order-ai").checked) {
        turn = 1;
    }

    setupLocalGame(holes, seeds, turn, aiDifficulty, name);
    pageManager.setPage("game-section");
    document.getElementById("game-status").classList.remove("invisible");
}

function cleanupGame(gameHash, evtSource) {
    document.getElementById("game-status").classList.add("invisible");

    if (toggleGameStatus.open) {
        toggleGameStatus();
    }

    if (gameHash != null) {
        evtSource.close();
        evtSource.onmessage = null;
        leaveGame(gameHash);
    }

    clearTimeouts();

    document.getElementById("message-board").innerText = "";
}

function setMenu() {
    pageManager.setPage("init-menu");
}

function setAuth() {
    startAuth();
}

function setConfig() {
    pageManager.setPage("init-menu");
}

function setWaitingPage() {
    clicker = new Clicker();
    pageManager.setPage("waiting-area");
}

function startAuth() {
    if (isAuthenticated()) return;
    pageManager.setPage("auth");

    document.getElementById("log-in-header").classList.add("hidden");
    document.getElementById("log-in-header").classList.remove("visible");
}

function cleanupAuth() {
    document.getElementById("username-login").value = null;
    document.getElementById("password-login").value = null;

    document.getElementById("log-in-header").classList.remove("hidden");
    document.getElementById("log-in-header").classList.add("visible");
}

function cleanupWait(gameHash, evtSource) {
    if (gameHash != null) {
        evtSource.close();
        evtSource.onmessage = null;
        leaveGame(gameHash);
    }

    clicker.close();
}

function setupInitMenu() {
    let setPageConfig = pageManager.setPage.bind(pageManager, "config-local");
    let setInitMenu = pageManager.setPage.bind(pageManager, "init-menu");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);

    document.getElementById("start-button").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            pageManager.setPage("config-multiplayer-matchmaking");
        }
    });

    document.getElementById("header-logo").addEventListener('click', setInitMenu);
    document.getElementById("log-in-header").addEventListener('click', () => startAuth(pageManager));

    pageManager.pageCleanup["auth"] = cleanupAuth;
}

function setupLocalGameConfig() {
    let startGameButton = document.getElementById("start-game-button");

    pageManager.pageCleanup["game-section"] = cleanupGame;
    startGameButton.addEventListener('click', () => startGame(pageManager));

    document.getElementById("exit-btn").addEventListener('click', pageManager.setPage.bind(pageManager, "init-menu"))
}

function setupPages() {
    setupInitMenu(pageManager);
    setupLocalGameConfig(pageManager);

    pageManager.setPage("init-menu");
}
