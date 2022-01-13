class Circle {
    /** @type {Position} */
    center;
    /** @type {number} */
    radius;
    /** @type {string} */
    strokeColor;
    /** @type {string} */
    fillColor;
    /** @type {number} */
    strokeWidth;

    constructor(position, radius, strokeColor, fillColor, strokeWidth) {
        this.center = position;
        this.radius = radius;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.strokeWidth = strokeWidth;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        const origFill = ctx.fillStyle;
        const origStroke = ctx.strokeStyle;
        const origWidth = ctx.lineWidth;

        ctx.fillStyle = this.fillColor;
        // console.log(ctx.fillStyle);
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;

        ctx.beginPath();

        ctx.arc(this.center.x + 0.5, this.center.y + 0.5, this.radius, 0, 2 * Math.PI);

        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = origFill;
        ctx.strokeStyle = origStroke;
        ctx.lineWidth = origWidth
    }

    inside(postion) {
        return Math.abs(postion.x - this.center.x) <= this.radius 
            && Math.abs(postion.y - this.center.y) <= this.radius;
    }
}