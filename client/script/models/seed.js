'use strict';

class Seed {
    #id;
    #x;
    #y;
    #rot;

    constructor(id) {
        this.#id = id;
        this.#x = Math.random() * 60;
        this.#y = Math.random() * (70 - 8) + 8;
        this.#rot = Math.random() * 90;
    }

    get id() {
        return this.#id;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get rot() {
        return this.#rot;
    }
}
