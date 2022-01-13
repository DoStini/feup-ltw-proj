class Cookie extends Circle {
    /** @type {Array.<Circle>} */
    chips = [];
    
    constructor(position, radius, stroke, fill, strokeWidth) {
        super(position, radius, stroke, fill, strokeWidth);
    }

    genChips(numChips, chipStroke, chipFill, maxRadius, minRadius) {
        for(let i = 0; i < numChips; i++) {
            const radius = Math.random() * (maxRadius - minRadius) + minRadius >> 0;
            const minX = radius + this.center.x - this.radius;
            const maxX = this.center.x + this.radius - radius;
            const x = Math.random() * (maxX - minX) + minX >> 0;
            const xAcc = (x - this.center.x) ** 2
            const xAcc2 = Math.sqrt(this.radius ** 2 - xAcc);
            const minY = this.center.y - xAcc2 + radius;
            const maxY = this.center.y + xAcc2 - radius;
            console.log("x ", x, " xAcc ", xAcc, " xAcc2 ", xAcc2, " min ", minY , " max ", maxY);
            const y = Math.random() * (maxY - minY) + minY >> 0;
            
            const chip = new Circle(new Position(x, y), radius, chipStroke, chipFill, 2);
            this.chips.push(chip);
        }
    }

    draw(ctx) {
        super.draw(ctx);

        this.chips.forEach((chip) => {
            chip.draw(ctx);
        })
    }
}