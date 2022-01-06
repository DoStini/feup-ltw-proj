const crypto = require('crypto');

const requestError = (res, code, message) => {
    return res.status(code).json({
        error: message,
    });
}

const hash = (key) => crypto
    .createHash('md5')
    .update(key)
    .digest('hex');

const checkHash = (raw, hashed) => {
    const rawHashed = hash(raw);

    return rawHashed === hashed;
}

module.exports = {
    requestError,
    hash,
    checkHash,
}