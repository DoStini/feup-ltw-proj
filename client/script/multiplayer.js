function setupMultiplayer() {
    document.querySelector("#config-multiplayer-create > form").addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        const formData = serializeFormData(new FormData(form));

        if (!formData.code) {
            launchErrorSnackbar("Group id not given");
        }

        const data = {
            group: parseInt(formData.code),
            size: formData.holes,
            initial: formData.seeds,
            nick: getUser(),
            password: getPass(),
        };

        const req = await join(data);

        if (req.status === STATUS_CODES.OK) {
            launchClipboardSnackbar("Room created! Click to copy code to clipboard", req.data.game, 4000);
        } else {
            launchErrorSnackbar(req.data?.error);
        }

    });

    document.querySelector("#config-multiplayer-join > form").addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        const formData = serializeFormData(new FormData(form));


        if (!formData.code) {
            launchErrorSnackbar("Group id not given");
        }

        const data = {
            group: parseInt(formData.code),
            nick: getUser(),
            password: getPass(),
        };

        const req = await join(data);
        console.log("join", formData, req)
    });

    document.querySelector("#config-multiplayer-matchmaking > form").addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        const formData = serializeFormData(new FormData(form));

        const data = {
            size: formData.holes,
            initial: formData.seeds,
            nick: getUser(),
            password: getPass(),
        };

        const req = await join(data);


        if (req.status === STATUS_CODES.OK) {
            launchSuccessSnackbar("Finding a game");
            console.log("req", req.data.game);
            handleGameStart(req.data.game);
        } else {
            launchErrorSnackbar(req.data?.error);
            return;
        }

    });
}

function handleGameStart(gameHash) {
    const query = encodeForQuery({
        game: gameHash,
        nick: getUser(),
    });

    const evtSource = new EventSource(`${getApiHost()}update?${query}`);

    evtSource.onmessage = (e) => console.log("event recv", JSON.parse(e.data))
}

setupMultiplayer();
