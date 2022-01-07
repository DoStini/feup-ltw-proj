const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");
const GameController = require("./src/controllers/gameController");

const app = new Framework();

loaders(app);

app.listen(config.PORT, () => {
    console.log(`listening on ${config.PORT}`);
});
