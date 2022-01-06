const crypto = require('crypto');
const FrameworkResponse = require('../framework/response');

/**
 * Sends an error
 * 
 * @param {FrameworkResponse} res 
 * @param {number} code 
 * @param {*} message 
 * 
 * @returns {void}
 */
const requestError = (res, code, message) => {
    res.status(code).json({
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