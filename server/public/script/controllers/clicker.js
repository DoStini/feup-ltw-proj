class Clicker {
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {Position} */
    center;
    frameHandle;
    /** @type {Cookie} */
    cookie;

    constructor() {
        this.canvas = document.getElementById("waiting-clicker");
        this.canvas.onmousemove = this.handleMouseMove.bind(this);
        this.ctx = this.canvas.getContext("2d");
        this.center = new Position(this.canvas.width/2, this.canvas.height/2);
        this.cookie = new Cookie(this.center, 50, "#84563c", "#bd8c61", 5);
        this.cookie.genChips(10, "#270d0b", "#5A2C22", 10, 5);
        this.run();
    }

    mouseToCoords(event) {
        let rect = this.canvas.getBoundingClientRect();

        return new Position(event.clientX - rect.left, event.clientY - rect.top);
    }

    handleMouseMove(e) {
        let position = this.mouseToCoords(e);

        if(this.cookie.inside(position)) {
            this.cookie.fillColor = "#9f7a59";
            document.body.style.cursor = "pointer";
        } else {
            this.cookie.fillColor = "#bd8c61";
            document.body.style.cursor = "default";
        }

    }

    run() {
        // this.ctx.beginPath();

        this.cookie.draw(this.ctx);

        this.frameHandle = requestAnimationFrame(this.run.bind(this));
    }

    close() {
        cancelAnimationFrame(this.frameHandle);

        // save
    }
}