const config = require("./src/env");
const Framework = require("./framework/framework");
const loaders = require("./src/loaders");
const cors = require("./framework/middleware/cors");

const app = new Framework();
app.use(cors);

loaders(app);

app.listen(config.PORT, () => {
    console.log(`listening on ${config.PORT}`);
});
