const sqlite3 = require('sqlite3').verbose();
const { Database } = require('sqlite3');
const DatabaseInterface = require('./DatabaseInterface');
const DatabaseModel = require("./DatabaseModel");

class SqlDatabase extends DatabaseInterface {
    /** @property {Object.<string, DatabaseModel>} models */
    #models = {};
    #path;
    #db;

    constructor (path) {
        super();
        this.#path = path;
    }

    setup() {
        this.#db = new sqlite3.Database(`${this.#path}/db.sql`, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the database.');

                Object.values(this.#models).forEach(model => model.setup());
            }
        );
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
