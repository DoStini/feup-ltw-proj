const { promises: fs } = require('fs');
const env = require('../env');
const DatabaseError = require('./DatabaseError');
const DatabaseModel = require('./DatabaseModel');
const SqlDatabase = require('./SqlDatabase');

class SqlModel extends DatabaseModel {

    #rows;
    #database;

    constructor (name, rows, database) {
        super(name);
        this.#rows = rows;
        this.#database = database;
    }

    /**
     * 
     * @param {SqlDatabase} database 
     */
    async setup() {
        let query = `CREATE TABLE IF NOT EXISTS ${this.name} (`;

        for (let index = 0; index < this.#rows.length - 1; index++) {
            const { name, type, constraint } = this.#rows[index];
            query += `${name} ${type} ${constraint},`
        }

        const { name, type, constraint } = this.#rows[this.#rows.length - 1];
        query += `${name} ${type} ${constraint});`;

        console.log(query)

        this.#database.runQuery(query);
    }

    async findByKey(key, value) {
        const query = `SELECT * FROM ${this.name} WHERE ${key} = '${value}'`;

        return this.#database.runQuery(query);
    }

    async insert(_key, obj) {
        let query = `INSERT INTO "${this.name}" (`
        Object.keys(obj).forEach(key => query += `${key},`);
        query = query.slice(0, query.length - 1) + `) values (`;
        Object.values(obj).forEach(val => query += `'${val}',`);
        query = query.slice(0, query.length - 1) + ");"

        await this.#database.runQuery(query);
    }

    async update(key, val, obj) {
        let query = `UPDATE "${this.name}" SET `

        let parsed = JSON.stringify(obj);
        parsed = parsed.slice(1, parsed.length - 1).replaceAll(":", "=");

        query += parsed + ` WHERE ${key}='${val}'`;

        await this.#database.runQuery(query);
    }

    async all() {
        await this.#database.runQuery(`SELECT * FROM ${this.name}`)
    }

    delete(key) {
        
    }

}

module.exports = SqlModel;
