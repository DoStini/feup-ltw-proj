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
        let middleRadius = endRadius * 1.1;
        let midIncrement = (middleRadius - 1) / (duration * 0.5);
        let increment = (endRadius - middleRadius) / (duration * 0.5);

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(1 + midIncrement * frame, 1 + midIncrement * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        },0))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(middleRadius + increment * frame, middleRadius + increment * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        },0.5))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(endRadius, endRadius);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        },1))
    }
}

class ClickAnimation extends CookieAnimation {
    constructor(duration, fromRad, toRad, clicker) {
        super(duration, false);
        const toIncrement = (toRad - fromRad) / (duration * 0.5);
        const maxRad = fromRad * 1.1;
        const maxIncrement = (maxRad - toRad) / (duration * 0.25);
        const fromIncrement = (fromRad - maxRad) / (duration * 0.25);

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(fromRad + toIncrement * frame, fromRad + toIncrement * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        }, 0))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(toRad + maxIncrement * frame, (toRad * 1.5) + maxIncrement * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        }, 0.5))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(maxRad + fromIncrement * frame, maxRad + fromIncrement * frame);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        }, 0.75))

        this.addKeyFrame(new KeyFrame((ctx, frame) => {
            ctx.save();

            ctx.translate(clicker.center.x, clicker.center.y);
            ctx.scale(fromRad, fromRad);
            ctx.translate(-clicker.center.x, -clicker.center.y);

            clicker.cookie.draw(ctx);
            clicker.overlay.draw(ctx);

            ctx.restore();
        }, 1))
    }
}

/**
 * @callback KeyFrameHandler
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} frame
 * 
 * @returns {void}
 */