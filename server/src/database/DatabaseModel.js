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

    find(key) {

    }

    insert(key, val) {
        
    }

    update(key, val) {

    }

    delete(key) {

    }

}

module.exports = DatabaseModel;

