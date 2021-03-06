function setupMultiplayer() {
    document.querySelector("#config-multiplayer-matchmaking > form").addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        const formData = serializeFormData(new FormData(form));

        const data = {
            size: formData.holes,
            initial: formData.seeds,
            group: formData.group,
            nick: getUser(),
            password: getPass(),
        };

        const req = await join(data);

        if (req.status === STATUS_CODES.OK) {
            launchSuccessSnackbar("Finding a game");
            handleGameStart(req.data.game);
        } else {
            launchErrorSnackbar(req.data?.error);
            return;
        }

    });
}

function parseBoard(data) {
    const user = getUser();
    const enemy = Object.keys(data.board.sides).find(el => el !== user);
    const turn = data.board.turn;

    const board = [...data.board.sides[user].pits, ...data.board.sides[enemy].pits, data.board.sides[user].store, data.board.sides[enemy].store]

    return {
        player: user,
        enemy,
        turn,
        board,
        holes: parseInt((board.length - 2) / 2),
    }
}

class MultiplayerInfo {
    /** @property {EventSource} evtSource */
    #evtSource;
    #gameHash;

    /**
     * 
     * @param {EventSource} evtSource 
     * @param {*} gameHash 
     */
    constructor(evtSource, gameHash) {
        this.#evtSource = evtSource;
        this.#gameHash = gameHash;
    }

    get evtSource() {
        return this.#evtSource;
    }

    get gameHash() {
        return this.#gameHash;
    }
}

function startMultiplayerGame(data, evtSource, gameHash) {
    const parsed = parseBoard(data);
    setupMultiplayerGame(parsed.holes, parsed.board[0], parsed.turn, parsed.player, parsed.enemy, new MultiplayerInfo(evtSource, gameHash));
    pageManager.pageCleanup["waiting-area"] = cleanupWait;
    pageManager.setPage("game-section");
    toggleGameStatus();
    document.getElementById("game-status").classList.remove("hidden");
}

function handleGameStart(gameHash) {
    const query = encodeForQuery({
        game: gameHash,
        nick: getUser(),
    });

    const evtSource = new EventSource(`${getApiHost()}update?${query}`);
    evtSource.onmessage = ((e) => { startMultiplayerGame(JSON.parse(e.data), evtSource, gameHash)}).bind(evtSource);

    pageManager.pageCleanup["waiting-area"] = cleanupWait.bind(this, gameHash, evtSource);
    pageManager.pageCleanup["game-section"] = cleanupGame.bind(this, gameHash, evtSource);

    setWaitingPage();
}

async function leaveGame(gameHash) {
    const request = {
        nick: getUser(),
        password: getPass(),
        game: gameHash
    }

    await leave(request);
}

setupMultiplayer();
