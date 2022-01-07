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
const requestError = (res, code, message, extra) => {
    res.status(code).json({
        error: message,
        ...extra
    });
}

/**
 * 
 * @param {Array} required 
 * @param {String} section - body,  params, query
 * @param {*} message 
 * @returns 
 */
const fieldsValidator = (required, section, message) => (req, res, next) => {
    const missing = required.filter(field => !req[section] || !req[section][field]);

    if (missing.length > 0) {
        return requestError(res, 400, message || "Invalid parameters", {
            required: missing
        });
    }

    return next(req, res);
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
    fieldsValidator,
}