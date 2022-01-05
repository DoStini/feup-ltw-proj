
class Middleware {
    next;
    handle;
    run;

    constructor(next, handle) {
        this.next = next;
        this.handle = handle;
        this.run = (req, res) => this.handle(req, res, this.next);
    }
}

module.exports = Middleware;