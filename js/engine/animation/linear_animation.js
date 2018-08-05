/**
 * Allows to change any object property over time.
 * Such object will look like it is animated.
 * Supports only linear property change.
 */
class LinearAnimation {
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