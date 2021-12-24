console.log(getApiHost())

function request(method, body, path) {
    let options = {
        method : method,
        body : JSON.stringify(body)
    }

    let request = new Request(getApiHost() + path, options);

    return fetch(request).then(response => response.json());
}

function postRequest(body, path) {
    return request('POST', body, path);
}

function retrieveLeaderboard() {
    const data = postRequest({}, "ranking");

    return data.then(response => response.ranking);
}
