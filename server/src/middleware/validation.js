class ValidationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

function testNumber(req, location, name, min, max) {
    const val = parseInt(req[location][name]);

    if(isNaN(val)) {
        throw new ValidationError(`The ${name} must be a number`, 400);
    }

    if(min != null && val < min) {
        throw new ValidationError(`The ${name} must be greater than or equal to ${min}`, 400);
    }

    if(max != null && val > max) {
        throw new ValidationError(`The ${name} must be lesser than or equal to ${max}`, 400);
    }
}

module.exports = {
    ValidationError,
    testNumber
}