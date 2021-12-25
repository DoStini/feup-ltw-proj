console.log(getApiHost())

async function request(method, body, path) {
    let options = {
        method : method,
        body : JSON.stringify(body)
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

function postRequest(body, path) {
    return request('POST', body, path);
}

function setCookie(name,value,minutes) {
    let expires = "";
    if (minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; SameSite=None; Secure;";
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
    const data = postRequest(body, "register");

    return data.then(response => response);
}
