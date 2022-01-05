class DatabaseModel {

    #name;

    constructor (name) {
        this.#name = name;
    }

    async setup() {

    }

    getName() {
        return this.#name
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

}

module.exports = DatabaseModel;

