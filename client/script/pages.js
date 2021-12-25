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

    updateAuthButtons();
}

function startGame() {
    let holes = document.getElementById("holes").value;
    let seeds = document.getElementById("seeds").value;

    setupGame(holes, seeds);
    pageManager.setPage("game-section");
    document.getElementById("game-status").classList.remove("hidden");
}

function cleanupGame() {
    document.getElementById("game-status").classList.add("hidden");

    if(toggleGameStatus.open) {
        toggleGameStatus();
    }
}

function setMenu() {
    pageManager.setPage("init-menu");
}

function setAuth() {
    startAuth();
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
    let setPageConfig = pageManager.setPage.bind(pageManager, "config");
    let setInitMenu = pageManager.setPage.bind(pageManager, "init-menu");

    document.getElementById("start-button-ai").addEventListener('click', setPageConfig);
    
    document.getElementById("start-button-server").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            alert("create a server");
        }
    });
    
    document.getElementById("join-button-server").addEventListener('click', (e) => {
        if (isAuthenticated()) {
            alert("join server");
        }
    });

    ["start-button-server", "join-button-server"].forEach(
        (id) => document.getElementById(id).addEventListener('mouseover', (e) => {
        const elem = e.target;
        if (isAuthenticated()) {
            elem.style.backgroundColor = "#373f41";
            elem.style.fontWeight = "600";
            elem.style.cursor = "pointer";
        } else {
            elem.style.backgroundColor = "";
            elem.style.fontWeight = "";
        }
    }));

    ["start-button-server", "join-button-server"].forEach(
        (id) => document.getElementById(id).addEventListener('mouseleave', (e) => {
            const elem = e.target;
            elem.style.cursor = "";
            elem.style.backgroundColor = "";
            elem.style.fontWeight = "";
        })
    );

    document.getElementById("header-logo").addEventListener('click', setInitMenu);
    document.getElementById("log-in-header").addEventListener('click', startAuth);

    pageManager.pageCleanup["auth"] = cleanupAuth;
}

function setupConfig() {
    let startGameButton = document.getElementById("start-game-button");

    pageManager.pageCleanup["game-section"] = cleanupGame;
    startGameButton.addEventListener('click', startGame);
}

function setupPages() {
    document.querySelectorAll(".in-body").forEach(bodyElement => {
        bodyElement.style.display = "none";
    });

    setupInitMenu();
    setupConfig();

    pageManager.setPage("init-menu");
}

let pageManager = new PageManager();
