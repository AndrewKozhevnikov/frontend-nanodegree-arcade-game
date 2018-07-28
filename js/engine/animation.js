class LinearAnimator {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo) {
        this.object = objectToAnimate;
        this.propertyName = propertyName;
        this.speed = speed;
        this.stopped = false;
        this.direction = (valueTo > valueFrom) ? 1 : -1;

        this.setValues(valueFrom, valueTo);
    }

    setOnAnimationEndCallback(callback) {
        this.animationEndCallback = callback;
    }

    setValues(valueFrom, valueTo) {
        this.valueFrom = valueFrom;
        this.valueTo = valueTo;
        this.value = valueFrom;
    }

    reset() {
        this.value = this.valueFrom;
        this.stopped = false;
    }

    update(dt) {
        if (this.stopped) {
            return;
        }

        this.value = this.value + this.speed * dt * this.direction;
        if ((this.direction > 0 && this.value >= this.valueTo) ||
            (this.direction < 0 && this.value <= this.valueTo)) {
            this.value = this.valueTo;
            this.stop();
        }
        this.object[this.propertyName] = this.value;
    }

    stop() {
        this.stopped = true;
        if (this.animationEndCallback != null) {
            this.animationEndCallback();
        }
    }
}

class DurationAnimator extends LinearAnimator {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo, duration) {
        super(objectToAnimate, propertyName, speed, valueFrom, valueTo);
        this.duration = duration;
        this.startTime = Date.now();
    }

    reset() {
        super.reset();
        this.startTime = Date.now();
    }

    update(dt) {
        if (Date.now() >= this.startTime + this.duration) {
            this.object[this.propertyName] = this.valueTo;
            this.stop();
        } else {
            super.update(dt);
        }
    }
}

class UpDownAnimator extends LinearAnimator {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo, repeatCount = -1, objectSize = 0) {
        super(objectToAnimate, propertyName, speed, valueFrom, valueTo);
        this.repeatCount = repeatCount;
        this.counter = 0;
        this.objectSize = objectSize;
        this.goingDownAtTheBeginning = (valueTo > valueFrom);
        this.direction = this.goingDownAtTheBeginning ? 1 : -1;
    }

    reset() {
        super.reset();
        this.counter = 0;
    }

    setValues(valueFrom, valueTo) {
        super.setValues(valueFrom, valueTo);
        this.goingDownAtTheBeginning = (valueTo > valueFrom);
        this.direction = this.goingDownAtTheBeginning ? 1 : -1;
    }

    update(dt) {
        if (this.stopped) {
            return;
        }

        this.value = this.value + this.speed * dt * this.direction;
        this.object[this.propertyName] = this.value;


        // There are two possible options
        // Here is a pic of two jumps
        // /\ jump up and then fall down
        // \/ fall down and then climb up
        if (this.goingDownAtTheBeginning) {
            if (this.direction > 0 && this.value + this.objectSize >= this.valueTo) {
                this.direction = -1;
                this.increaseCounter();
            } else if (this.direction < 0 && this.value <= this.valueFrom) {
                this.direction = 1;
                this.increaseCounter();
            }
        } else {
            if (this.direction < 0 && this.value <= this.valueTo) {
                this.direction = 1;
                this.increaseCounter();
            } else if (this.direction > 0 && this.value + this.objectSize >= this.valueFrom) {
                this.direction = -1;
                this.increaseCounter();
            }
        }

        if ((this.repeatCount !== -1) && (this.counter / 2) >= this.repeatCount){
            this.stop();
        }
    }

    increaseCounter() {
        if (this.repeatCount !== -1) {
            this.counter++;
        }
    }

    stop() {
        this.counter = 0;
        super.stop();
    }
}

// done
// ---------------------------------------------------------
// unfinished

class FadeOutAnimation {
    constructor(time) {
        this.time = time;
        this.fromAlpha = 1.0 * 1000; // 1000 because of dt from engine.
    }

    update(dt) {
        return -(dt * this.fromAlpha / this.time);
    }
}
