const { promises: fs } = require('fs');
const env = require('../env');
const DatabaseModel = require('./DatabaseModel');

class JsonModel extends DatabaseModel {

    #path;

    constructor (name) {
        super(name);
        this.#path = `${env.DATA_PATH}/${name}.json`;
    }

    async setup() {
        return fs.access(this.#path, fs.F_OK, (err) => {
                    fs.writeFile(this.#path, JSON.stringify({}),(err) => console.error(err));
        });
    }

    async find(key) {
        const data = JSON.parse((await fs.readFile(this.#path)).toString());
        return data[key];
    }

    insert(key, val) {
        
    }

    update(key, val) {

    }

    delete(key) {
        
    }

}

module.exports = JsonModel;
