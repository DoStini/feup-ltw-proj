const sqlite3 = require('sqlite3').verbose();
const { Database } = require('sqlite3');
const DatabaseInterface = require('./DatabaseInterface');
const DatabaseModel = require("./DatabaseModel");

class SqlDatabase extends DatabaseInterface {
    /** @type {Object.<string, DatabaseModel>} models */
    #models = {};
    #path;
    #db;

    constructor (path) {
        super();
        this.#path = path;
    }

    setup() {
        const name = this.#path === ":memory:" ? this.#path : `${this.#path}/db.sql`;
        
        return new Promise(async function(resolve,reject){
            this.#db = new sqlite3.Database(name, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
                async (err) => {
                    if (err) {
                        console.error(err.message);
                        reject();
                    }
                    console.log('Connected to the database.');
    
                    await Promise.all(Object.values(this.#models).map((model) => model.setup()))
                    resolve();
                }
            );
        }.bind(this));
    }

    /**
     * 
     * @param {Function} query 
     */
    runQuery(query) {
        return new Promise(function(resolve,reject){
            this.#db.all(query, function(err,rows){
               if(err){return reject(err);}
               resolve(rows);
             });
        }.bind(this));
    }

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

module.exports = SqlDatabase;
