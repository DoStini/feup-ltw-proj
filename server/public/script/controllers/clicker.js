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
     /** @type {number} */
    cookies;

    constructor() {
        this.canvas = document.getElementById("waiting-clicker");
        this.canvas.onmousemove = this.handleMouseMove.bind(this);
        this.canvas.onclick = this.handleClick.bind(this);
        this.ctx = this.canvas.getContext("2d");

        this.ctx.translate(0.5, 0.5);
        this.ctx.font = "600 14px Mulish, sans-serif"

        this.center = new Position(this.canvas.width/2, this.canvas.height/2);
        this.cookie = new Cookie(this.center, 50, "#84563c", "#bd8c61", 5);
        this.overlay = new Circle(this.center, this.cookie.radius, "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", 0);
        
        this.cookie.genChips(10, "#270d0b", "#5A2C22", 8, 3);

        if(!localStorage.getItem("cookies")) {
            localStorage.setItem("cookies", "0");
        }

        this.cookies = parseInt(localStorage.getItem("cookies"));

        this.animation = new RotationCombinedAnimation(0.01, this);
        this.animation.animation = new NoAnimation(this);
        this.animation.animation.start();
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
            this.animation.animation = new ClickAnimation(13, 1.15, 0.75, this);
            this.animation.animation.start();
            this.cookies++;
        }
    }

    handleMouseMove(e) {
        let position = this.mouseToCoords(e);

        if(this.cookie.inside(position)) {
            if(!(this.animation.animation instanceof HoverAnimation)) {
                this.animation.animation = new HoverAnimation(10, 1.15, this);
                this.animation.animation.start();
            }

            document.body.style.cursor = "pointer";
        } else {
            this.animation.animation = new NoAnimation(this);
            this.animation.animation.start();
            document.body.style.cursor = "default";
        }

    }

    run() {
        // this.cookie.draw(this.ctx);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let startArrowX = this.center.x - this.cookie.radius;
        let startArrowY =  this.center.y + this.cookie.radius;

        if(this.cookies === 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(startArrowX, startArrowY);
            this.ctx.bezierCurveTo(startArrowX - 40, startArrowY + 40, startArrowX + 100, startArrowY, startArrowX + 100, startArrowY + 40);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(startArrowX - 10, startArrowY);
            this.ctx.lineTo(startArrowX + 5, startArrowY - 10);
            this.ctx.lineTo(startArrowX + 10, startArrowY + 5);
            this.ctx.stroke();

        }

        this.animation.next(this.ctx);

        let message = "You have " + this.cookies + " cookies.";
        let text = this.ctx.measureText(message);

        const origFill = this.ctx.fillStyle;
        this.ctx.fillStyle = "#373f41";
        this.ctx.fillText(message, this.center.x - text.width / 2, 20);
        this.ctx.fillStyle = origFill;

        if(this.cookies === 0) {
            message = "Click to get cookies!";
            text = this.ctx.measureText(message);
            this.ctx.fillText(message, this.center.x - text.width / 2, startArrowY + 60);
        }

        this.ctx.fillStyle = origFill;

        this.frameHandle = requestAnimationFrame(this.run.bind(this));
    }

    close() {
        cancelAnimationFrame(this.frameHandle);

        localStorage.setItem("cookies", this.cookies);
    }
}