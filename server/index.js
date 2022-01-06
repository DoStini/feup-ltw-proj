const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");
const GameController = require("./src/controllers/gameController");

const app = new Framework();

loaders(app);

app.listen(config.PORT, () => {
    console.log(`listening on ${config.PORT}`);
        
    let game = GameController.setupMultiplayerGame(1, 1, "nuno", "nuno", "mafalda", "as31234");
    console.log(game.board.seeds);

    console.log(game.clickHole(0));


    console.log(game.board.seeds);
    console.log(game.board.storage);

});
