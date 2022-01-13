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
        this.ctx = this.canvas.getContext("2d");
        this.center = new Position(this.canvas.width/2, this.canvas.height/2);
        this.cookie = new Cookie(this.center, 50, "#84563c", "#bd8c61", 5);
        this.animation = new CookieAnimation(60);
        this.animation.addKeyFrame(new KeyFrame(((ctx) => this.cookie.draw(ctx)).bind(this), 0));
        this.animation.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(this.center.x, this.center.y);
            ctx.scale(1 + 0.01 * frame, 1 + 0.01 * frame);
            ctx.translate(-this.center.x, -this.center.y);


            this.cookie.draw(ctx);

            if(this.hover) {
                this.overlay.draw(this.ctx);
            }
            ctx.restore();
        }, 0.5));

        this.animation.start();
        this.overlay = new Circle(this.center, 50, "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", 0);
        this.cookie.genChips(10, "#270d0b", "#5A2C22", 8, 3);
        this.hover = false;
        this.run();
    }

    mouseToCoords(event) {
        let rect = this.canvas.getBoundingClientRect();

        return new Position(event.clientX - rect.left, event.clientY - rect.top);
    }

    handleMouseMove(e) {
        let position = this.mouseToCoords(e);

        if(this.cookie.inside(position)) {
            this.hover = true;
            document.body.style.cursor = "pointer";
        } else {
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