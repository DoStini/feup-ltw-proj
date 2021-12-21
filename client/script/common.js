'use strict';

let timeoutList = new Array();

function setTimeoutClearable(callback, time) {
    let timeoutHandle = setTimeout(callback, time);
    timeoutList.push(timeoutHandle);
}

function clearTimeouts() {
    timeoutList.forEach((handle) => {
        clearTimeout(handle);
    });

    timeoutList.length = 0;
}
