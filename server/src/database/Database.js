class Database {

    #models = {};

    async setup() {

    }

    /**
     * 
     * @param {DatabaseModel} model 
     */
    addModel(model) {
        this.#models[model.getName()] = model; 
    }

    /**
     * 
     * @param {string} name Model name
     */
    getModel(name) {
        return this.#models[name];
    }

}

module.exports = Database;
