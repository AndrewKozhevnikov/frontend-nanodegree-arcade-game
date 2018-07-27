class ValueAnimator {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo) { // what is speed? sec? milli?
        this.object = objectToAnimate;
        this.propertyName = propertyName;
        this.speed = speed;
        this.setValues(valueFrom, valueTo);
        this.stopped = false;
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

        this.value = this.value + this.speed * dt;
        if ((this.speed > 0 && this.value >= this.valueTo) ||
            (this.speed < 0 && this.value <= this.valueTo)){
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

class DurationAnimator extends ValueAnimator {
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

class UpDownAnimator extends ValueAnimator {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo, repeatCount = -1){
        super(objectToAnimate, propertyName, speed, valueFrom, valueTo);
        this.direction = 1;
        this.repeatCount = repeatCount;
        this.counter = 0;
    }

    reset() {
        super.reset();
        this.counter = 0;
    }

    update(dt) {
        if (this.stopped) {
            return;
        }

        this.value = this.value + this.speed * dt * this.direction;

        if (this.direction < 0 && this.value <= this.valueFrom) {
            this.value = this.valueFrom;
        } else if (this.direction > 0 && this.value >= this.valueTo) {
            this.value = this.valueTo;
        }

        this.object[this.propertyName] = this.value;


        if (this.value >= this.valueTo) {
            this.direction = -1;
            this.increaseCounter();
        } else if (this.value <= this.valueFrom) {
            this.direction = 1;
            this.increaseCounter();
        }

        if ((this.repeatCount !== -1) && (this.counter / 2) >= this.repeatCount) {
            this.stop();
        }
    }

    increaseCounter() {
        if (this.repeatCount !== -1) {
            this.counter++;
            console.log(this.counter);
        }
    }

    stop() {
        this.counter = 0;
        super.stop();
    }
}

// ----------------------------------------------------

class ForwardAndBackAnimation {
    constructor(speed = 15, min = -8, max = 8, objectWidth = 0) {
        this.speed = speed;
        this.offset = min;
        this.min = min;
        this.max = max;
        this.direction = 1;
        this.objectWidth = objectWidth;
    }

    update(dt) {
        if (this.offset <= this.min) {
            this.direction = 1;
        } else if (this.offset + this.objectWidth >= this.max) {
            this.direction = -1;
        }

        this.offset = this.offset + this.speed * dt * this.direction;

        return this.speed * dt * this.direction;
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
