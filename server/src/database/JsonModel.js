const { promises: fs } = require('fs');
const env = require('../env');
const DatabaseModel = require('./DatabaseModel');

class JsonModel extends DatabaseModel {

    #path;

    constructor (name) {
        super(name);
        this.#path = `${env.DATA_PATH}/${name}.json`;
    }

    setup() {
        return fs.access(this.#path, fs.F_OK, (err) => {
                fs.writeFile(this.#path, JSON.stringify({}),(err) => console.error(err));
        });
    }

    async find(key) {
        const data = JSON.parse((await fs.readFile(this.#path)).toString());
        return data[key];
    }

    async insert(key, val) {
        const data = JSON.parse((await fs.readFile(this.#path)).toString());
        
        if (data[key] != null) {
            throw new DatabaseException("Already exists");
        }
       
        data[key] = val;

        fs.writeFile(this.#path, JSON.stringify(data));
    }

    async update(key, val) {
        const data = JSON.parse((await fs.readFile(this.#path)).toString());

        if(data[key] == null) {
            throw new DatabaseException("Key does not exist.");
        }

        data[key] = val;

        await fs.writeFile(this.#path, JSON.stringify(data))
    }

    delete(key) {
        
    }

}

module.exports = JsonModel;
