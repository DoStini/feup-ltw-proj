const DatabaseModel = require("./DatabaseModel");

class DatabaseInterface {
    /** @property {Object.<string, DatabaseModel>} models */
    #models = {};

    constructor () {}

    /**
     * Adds a DatabaseModel to the database.
     * 
     * @param {DatabaseModel} model 
     */
    addModel(model) {
        this.#models[model.name] = model; 
    }

    /**
     * Gets the DatabaseModel with the name name.
     * 
     * @param {string} name Model name
     * 
     * @returns {DatabaseModel}
     */
    getModel(name) {
        return this.#models[name];
    }

}

module.exports = DatabaseInterface;
