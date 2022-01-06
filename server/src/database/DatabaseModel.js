class DatabaseModel {
    /** @property {string} name */
    #name;

    /** @param {string} name */
    constructor (name) {
        this.#name = name;
    }

    async setup() {

    }

    get name() {
        return this.#name;
    }

    /**
     * 
     * @param {*} key 
     */
    async find(key) {

    }

    async insert(key, val) {
        
    }

    async update(key, val) {

    }

    async delete(key) {

    }

    async all() {
        
    }

}

module.exports = DatabaseModel;

