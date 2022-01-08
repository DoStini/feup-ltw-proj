const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");
const cors = require("./framework/middleware/cors");
const fileServer = require("./src/middleware/fileServer");

const app = new Framework({notFoundHandler : fileServer});

app.use(cors);
loaders(app);

app.listen(config.PORT, () => {
    console.log(`listening on ${config.PORT}`);
});
