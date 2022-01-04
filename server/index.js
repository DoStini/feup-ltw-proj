const config = require("./src/env");
const Framework = require("./framework/framework");
const app = new Framework();

app.listen(config.PORT, () => {
    console.log(`App listening at ${config.PORT}`);

});
