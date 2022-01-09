console.log(getApiHost())

function encodeForQuery(data) {
    if (data == null) return null;
    return Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
}

async function bodyRequest(method, body, path) {
    let options = {
        method: method,
        body: JSON.stringify(body)
    }

    let request = new Request(getApiHost() + path, options);

    return fetch(request).then(async (fetched) => {
        const data = await fetched.json();
        return {
            status: fetched.status,
            data,
        };
    });
}

async function queryRequest(method, data, path) {
    let options = {
        method: method,
    }
    let request = new Request(getApiHost() + path + "?" + encodeForQuery(data), options);

    return fetch(request).then(async (fetched) => {
        const data = await fetched.json();
        return {
            status: fetched.status,
            data,
        };
    });
}

function postRequest(body, path) {
    return bodyRequest('POST', body, path);
}

function getRequest(body, path) {
    return queryRequest('GET', body, path);
}

function setCookie(name, value, minutes) {
    let expires = "";
    if (minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value ?? "") + expires + ";";
}

function getCookie(name) {
    return document.cookie
        .split('; ')
        ?.find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
}

function serializeFormData(formData) {
    let object = {};
    formData.forEach((value, key) => object[key] = value);
    return object;
}

function retrieveLeaderboard() {
    const data = postRequest({}, "ranking");
    return data.then(response => response.data.ranking);
}

function login(body) {
    return postRequest(body, "register");
}

function join(body) {
    return postRequest(body, "join");
}

function leave(body) {
    return postRequest(body, "leave");
}

function update(body) {
    return getRequest(body, "update");
}
