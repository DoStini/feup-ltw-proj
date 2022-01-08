const env = require("../../src/env");

module.exports = (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', env.CORS_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');  
    res.setHeader('Access-Control-Allow-Headers', '*');
}
