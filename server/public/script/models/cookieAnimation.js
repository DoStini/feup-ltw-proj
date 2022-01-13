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

    constructor(duration) {
        this.duration = duration;
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
        this.keyframes[this.curKey].draw(ctx, this.curFrame - this.lastKeyFrame);
        console.log(this.curFrame / this.duration);

        this.curFrame++;

        if(this.end()) {
            this.curFrame = 0;
            this.lastKeyFrame = 0;
            this.curKey = 0;
        } else {
            if(this.curKey < this.keyframes.length - 1 && this.curFrame / this.duration >= this.keyframes[this.curKey + 1].start) {
                this.curKey++;
                this.lastKeyFrame = this.curFrame;
            }
        }
    }

    end() {
        return this.curFrame === this.duration;
    }
}

/**
 * @callback KeyFrameHandler
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} start
 * 
 * @returns {void}
 */