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
    /** @type {Circle} */
    overlay;
    hover;

    constructor() {
        this.canvas = document.getElementById("waiting-clicker");
        this.canvas.onmousemove = this.handleMouseMove.bind(this);
        this.canvas.onclick = this.handleClick.bind(this);
        this.ctx = this.canvas.getContext("2d");

        this.center = new Position(this.canvas.width/2, this.canvas.height/2);
        this.cookie = new Cookie(this.center, 50, "#84563c", "#bd8c61", 5);
        this.overlay = new Circle(this.center, this.cookie.radius, "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", 0);
        
        this.cookie.genChips(10, "#270d0b", "#5A2C22", 8, 3);
        this.hover = false;

        this.animation = new NoAnimation(this);
        this.animation.start();
        this.run();
    }

    mouseToCoords(event) {
        let rect = this.canvas.getBoundingClientRect();

        return new Position(event.clientX - rect.left, event.clientY - rect.top);
    }

    handleClick(e) {
        let position = this.mouseToCoords(e);

        if(this.cookie.inside(position)) {
            this.animation = new ClickAnimation(13, 1.15, 0.75, this);
            this.animation.start();
        }
    }

    handleMouseMove(e) {
        let position = this.mouseToCoords(e);

        if(this.cookie.inside(position)) {
            this.hover = true;
            if(!(this.animation instanceof HoverAnimation)) {
                this.animation = new HoverAnimation(10, 1.15, this);
                this.animation.start();
            }

            document.body.style.cursor = "pointer";
        } else {
            this.animation = new NoAnimation(this);
            this.animation.start();
            this.hover = false;
            document.body.style.cursor = "default";
        }

    }

    run() {
        // this.cookie.draw(this.ctx);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.animation.next(this.ctx);

        this.frameHandle = requestAnimationFrame(this.run.bind(this));
    }

    close() {
        cancelAnimationFrame(this.frameHandle);

        // save
    }
}