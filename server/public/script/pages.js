'use strict';

const pageManager = new PageManager();

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

    updateAuthButtons();
}

function startGame(pageManager) {
    let holes = parseInt(document.getElementById("holes").value);
    let seeds = parseInt(document.getElementById("seeds").value);
    let aiDifficulty = document.getElementById("ai_difficulty").value;
    let turn = 0;

    if (document.getElementById("ai-order-ai").checked) {
        turn = 1;
    }

    setupLocalGame(holes, seeds, turn, aiDifficulty);
    pageManager.setPage("game-section");
    document.getElementById("game-status").classList.remove("hidden");
}

function cleanupGame(gameHash, evtSource) {
    document.getElementById("game-status").classList.add("hidden");

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
    pageManager.setPage("waiting-area");
}

function startAuth() {
    if (isAuthenticated()) return;
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

function setupInitMenu() {
    let setPageConfig = pageManager.setPage.bind(pageManager, "config-local");
    let setInitMenu = pageManager.setPage.bind(pageManager, "init-menu");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);


    document.getElementById("create-button").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            pageManager.setPage("config-multiplayer-create");
        }
    });

    document.getElementById("join-button").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            pageManager.setPage("config-multiplayer-join");
        }
    });

    document.getElementById("start-button").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            pageManager.setPage("config-multiplayer-matchmaking");
        }
    });

    [
        "create-button",
        "join-button",
        "start-button",
    ].forEach(id => {
        const target = document.getElementById(id);

        target.addEventListener('mouseover', (e) => {
            const elem = e.target;
            if (isAuthenticated()) {
                elem.style.backgroundColor = "#373f41";
                elem.style.fontWeight = "600";
                elem.style.cursor = "pointer";
            } else {
                elem.style.backgroundColor = "";
                elem.style.fontWeight = "";
            }
        });

        target.addEventListener('mouseleave', (e) => {
            const elem = e.target;
            elem.style.cursor = "";
            elem.style.backgroundColor = "";
            elem.style.fontWeight = "";
        });
    })

    document.getElementById("header-logo").addEventListener('click', setInitMenu);
    document.getElementById("log-in-header").addEventListener('click', () => startAuth(pageManager));

    pageManager.pageCleanup["auth"] = cleanupAuth;
}

function setupLocalGameConfig() {
    let startGameButton = document.getElementById("start-game-button");

    pageManager.pageCleanup["game-section"] = cleanupGame;
    startGameButton.addEventListener('click', () => startGame(pageManager));
}

function setupPages() {
    document.querySelectorAll(".in-body").forEach(bodyElement => {
        bodyElement.style.display = "none";
    });

    setupInitMenu(pageManager);
    setupLocalGameConfig(pageManager);

    pageManager.setPage("init-menu");
}
