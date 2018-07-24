/**
 * interchanggable
 */
class SlideUpAnimation {
    constructor(movement = 150) {
        this.movement = movement;
    }

    update(dt) {
        return -this.movement * dt;
    }
}

class SlideUpDownAnimation {
    constructor(minYOffset = -8, maxYOffset = 8, movement = 15) {
        this.offset = 0;
        this.minOffset = minYOffset;
        this.maxOffset = maxYOffset;
        this.movement = movement;
        this.direction = 1;
    }

    update(dt) {
        if (this.offset <= this.minOffset) {
            this.direction = 1;
        } else if (this.offset >= this.maxOffset) {
            this.direction = -1
        }

        // todo rename movement
        this.offset = this.offset + this.movement * dt * this.direction;

        return this.movement * dt * this.direction;
    }
}

class FadeOutAnimation {
    constructor(time) {
        this.time = time;
        this.fromAlpha = 1.0 * 1000; // 1000 because of dt from engine.
    }

    update(dt) {
        return -(dt * this.fromAlpha / this.time);
    }
}
