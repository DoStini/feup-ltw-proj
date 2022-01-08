const timeout = 2000;
const targetPosition = "5vh";
const diffPosition = "1000px";


function launchSuccessSnackbar(message) {
    const icon = document.createElement("i");
    icon.className = "fas fa-check-square";
    icon.setAttribute("success", "");

    launchSnackbar(icon, message);
}

function launchClipboardSnackbar(message, value, timeout) {
    const icon = document.createElement("i");
    icon.className = "fas fa-check-square";
    icon.setAttribute("success", "");

    const elem = document.createElement("div");
    elem.classList.add("snackbar");
    elem.style.cursor = "pointer";

    const p = document.createElement("p");
    p.innerText = message;

    elem.append(icon);
    elem.append(p);

    document.body.append(elem)

    elem.addEventListener("click", () => navigator.clipboard.writeText(value));
    setTimeout(() => closeSnackbar(elem), timeout);

    openSnackbar(elem);
}

function launchErrorSnackbar(message) {
    const icon = document.createElement("i");
    icon.className = "fas fa-exclamation-triangle";
    icon.setAttribute("error", "");

    launchSnackbar(icon, message);
}

function openSnackbar(snackbar) {
    snackbar.style.transform = `translateX(-${diffPosition})`;
    snackbar.style.opacity = "0";
    setTimeout(() => {
        snackbar.style.transform = "";
        snackbar.style.opacity = "1";
    }, 100);
}

function closeSnackbar(snackbar) {
    setTimeout(() => {
        snackbar.style.transform = `translateX(${diffPosition})`
        snackbar.style.opacity = "0";
    }, 10);

    setTimeout(() => snackbar.remove(), 1010);
}

function launchSnackbar(icon, message) {
    const elem = document.createElement("div");
    elem.classList.add("snackbar");

    const p = document.createElement("p");
    p.innerText = message ?? "Unexpected situation";

    elem.append(icon);
    elem.append(p);

    document.body.append(elem)

    openSnackbar(elem);

    elem.addEventListener("mouseover", () => closeSnackbar(elem));
    setTimeout(() => closeSnackbar(elem), timeout);
}
