let session = {
}

function setupClickListeners() {
    const form = document.getElementById("login-form");

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        loginHandler(serializeFormData(formData));
    });

    document.getElementById("log-out-header").addEventListener('click', logout);
}

async function loginHandler(data) {
    const resp = await login(data);

    if (resp.status === STATUS_CODES.OK) {
        // Use cookies to persist session in broswer
        setCookie("user", data.nick, 30);
        setCookie("pass", data.password, 30);

        // Use dynamic session to prevent losing session after cookies expired
        session = {
            user: data.nick,
            pass: data.password,
        };

        setMenu();
        launchSuccessSnackbar("Logged in successfully");
    } else {
        launchErrorSnackbar(resp.data.error);
    }
}

function setupAuth() {
    setupClickListeners();
}

function getUser() {
    return session.user;
}

function getPass() {
    return session.pass;
}

function isAuthenticated() {
    return session?.user && session?.pass;
}

function logout() {
    pageManager.setPage("init-menu");

    setCookie("user", "", -1);
    setCookie("pass", "", -1);

    session = {};

    updateAuthButtons();

    launchSuccessSnackbar("Logged out successfully");
}

function replaceButtonsLogout() {
    const login = document.getElementById("log-in-header");
    const logout = document.getElementById("log-out-header");

    login.style.visibility = "collapse";
    logout.style.visibility = "visible";
}

function replaceButtonsLogin() {
    const login = document.getElementById("log-in-header");
    const logout = document.getElementById("log-out-header");

    login.style.visibility = "visible";
    logout.style.visibility = "collapse";
}

function updateAuthButtons() {
    if (isAuthenticated()) {
        replaceButtonsLogout();
    } else {
        replaceButtonsLogin();
    }
}

// Cookies nit working after broswer restart

function restoreSession() {
    const userCookie = getCookie("user");
    const passCookie = getCookie("pass");
    if (userCookie && passCookie) {
        session = {
            user: userCookie,
            pass: passCookie,
        }
    }
}

restoreSession();
updateAuthButtons();