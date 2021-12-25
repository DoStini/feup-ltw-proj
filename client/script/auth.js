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
    console.log(resp)

    if (resp.status === STATUS_CODES.OK) {
        console.log("hello")
        setCookie("user", data.nick, 30);
        setCookie("pass", data.password, 30);
        setMenu();
    }
}

function setupAuth() {
    setupClickListeners();
}

function isAuthenticated() {
    console.log(getCookie("user"))
    return getCookie("user") && getCookie("pass");
}

function logout() {
    setCookie("user", "", -1);
    setCookie("pass", "", -1);
    startAuth();
}

function replaceButtonsLogout() {
    const login = document.getElementById("log-in-header");
    const logout = document.getElementById("log-out-header");

    login.style.visibility="collapse";
    logout.style.visibility="visible";
}

function replaceButtonsLogin() {
    const login = document.getElementById("log-in-header");
    const logout = document.getElementById("log-out-header");

    login.style.visibility="visible";
    logout.style.visibility="collapse";
}

function updateAuthButtons() {
    if (isAuthenticated()) {
        replaceButtonsLogout();
    } else {
        replaceButtonsLogin();
    }
}

setInterval(() => {
    updateAuthButtons();
}, 1000);

updateAuthButtons();