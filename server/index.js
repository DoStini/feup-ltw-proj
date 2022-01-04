const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");

const app = new Framework();

loaders(app);

app.listen(config.PORT);
