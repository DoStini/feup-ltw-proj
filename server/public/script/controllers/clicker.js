class Clicker {
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {Position} */
    center;
    frameHandle;

    constructor() {
        this.canvas = document.getElementById("waiting-clicker");
        this.ctx = this.canvas.getContext("2d");
        this.center = new Position(this.canvas.width/2, this.canvas.height/2);
        this.run();
    }

    run() {
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, 50, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.frameHandle = requestAnimationFrame(this.run.bind(this));
    }

    close() {
        cancelAnimationFrame(this.frameHandle);

        // save
    }
}