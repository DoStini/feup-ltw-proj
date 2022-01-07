const { promises: fs } = require('fs');
const env = require('../env');
const DatabaseError = require('./DatabaseError');
const DatabaseModel = require('./DatabaseModel');

class JsonModel extends DatabaseModel {

    #path;

    constructor (name) {
        super(name);
        this.#path = `${env.DATA_PATH}/${name}.json`;
    }

    async setup() {
        try {
            await fs.access(this.#path, fs.F_OK);
        } catch {
            fs.writeFile(this.#path, JSON.stringify({}));
        }
    }

    async find(key) {
        await this.setup();

        const data = JSON.parse((await fs.readFile(this.#path)).toString());
        return data[key];
    }

    async insert(key, val) {
        await this.setup();

        const data = JSON.parse((await fs.readFile(this.#path)).toString());
        
        if (data[key] != null) {
            throw new DatabaseError("Already exists");
        }
       
        data[key] = val;

        await fs.writeFile(this.#path, JSON.stringify(data));
    }

    async update(key, val) {
        await this.setup();

        const data = JSON.parse((await fs.readFile(this.#path)).toString());

        if(data[key] == null) {
            throw new DatabaseError("Key does not exist.");
        }

        data[key] = val;

        await fs.writeFile(this.#path, JSON.stringify(data))
    }

    async all() {
        await this.setup();

        return JSON.parse((await fs.readFile(this.#path)).toString());
    }

    delete(key) {
        
    }

}

module.exports = JsonModel;
