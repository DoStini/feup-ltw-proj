class KeyFrame {
    /** @type {KeyFrameHandler} */
    draw;
    /** @type {number} */
    start;

    /** @param {KeyFrameHandler} draw */
    constructor(draw, start) {
        this.draw = draw;
        this.start = start;
    }
}

class CookieAnimation {
    /** @type {Array.<KeyFrame>} */
    keyframes = [];
    /** @type {number} */
    duration;
    /** @type {number} */
    curFrame;
    /** @type {number} */
    curKey;
    lastKeyFrame;
    /** @type {boolean} */
    repeats;

    constructor(duration, repeats) {
        this.duration = duration;
        this.repeats = repeats;
    }
    
    addKeyFrame(keyframe) {
        this.keyframes.push(keyframe);
    }

    start() {
        this.curFrame = 0;
        this.lastKeyFrame = 0;
        this.curKey = 0;
    }

    next(ctx) {
        if(this.end() && this.repeats) {
            this.curFrame = 0;
            this.lastKeyFrame = 0;
            this.curKey = 0;
        } else if(this.curKey < this.keyframes.length - 1 && this.curFrame / this.duration >= this.keyframes[this.curKey + 1].start) {
            this.curKey++;
            this.lastKeyFrame = this.curFrame;
        }

        this.keyframes[this.curKey].draw(ctx, this.curFrame - this.lastKeyFrame);

        this.curFrame++;
    }

    end() {
        return this.curFrame === this.duration;
    }
}

class NoAnimation extends CookieAnimation {
    constructor(clicker) {
        super(1, false);

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            clicker.cookie.draw(ctx);
        }, 0))
    }
}

class HoverAnimation extends CookieAnimation {
    constructor(duration, endRadius, clicker) {
        super(duration, false);
        endRadius = endRadius - 1;
        let middleRadius = endRadius / 1.25;
        let increment = endRadius / (duration * 0.5);
        let midIncrement = (endRadius - middleRadius) / (duration * 0.5);
        this.overlay = new Circle(clicker.center, clicker.cookie.radius, "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", 0);

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(1 + increment * frame, 1 + increment * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            this.overlay.draw(ctx);

            ctx.restore();
        },0))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(1+ endRadius - midIncrement * frame, 1 + endRadius - midIncrement * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            this.overlay.draw(ctx);

            ctx.restore();
        },0.5))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();
            console.log("hey");

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(1+ middleRadius, 1 + middleRadius);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            this.overlay.draw(ctx);

            ctx.restore();
        },1))
    }
}

/**
 * @callback KeyFrameHandler
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} frame
 * 
 * @returns {void}
 */