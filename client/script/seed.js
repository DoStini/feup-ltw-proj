'use strict';

class Seed {
    constructor(id) {
        this.id = id;
        this.x = Math.random() * 60;
        this.y = Math.random() * (70 - 8) + 8;
        this.rot = Math.random() * 90;
    }
}
