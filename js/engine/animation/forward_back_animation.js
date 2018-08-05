/**
 * Works as two combined linear animations.
 * First change value from valueFrom to valueTo and then go back.
 * This cycle could be repeated constantly or have several repeats.
 */
class ForwardBackAnimation extends LinearAnimation {
    constructor(objectToAnimate, propertyName, speed, valueFrom, valueTo, repeatCount = -1, objectSize = 0) {
        super(objectToAnimate, propertyName, speed, valueFrom, valueTo);

        // if repeatCount = -1 this animation will be repeated constantly
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
