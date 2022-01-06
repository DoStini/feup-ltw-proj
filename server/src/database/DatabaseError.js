class DatabaseError extends Error {
    constructor (msg) {
        super(msg);
    }
}

module.exports = DatabaseError;
