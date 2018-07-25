class Animation {
    constructor(speed = 150) {
        this.setSpeed(speed);
    }

    setSpeed(speed) {
        this.speed = speed;
    }
}

class MoveAnimation extends Animation {
    update(dt) {
        return this.speed * dt;
    }
}

class MoveBackAnimation extends MoveAnimation {
    update(dt) {
        return -super.update(dt);
    }
}

class ForwardAndBackAnimation extends Animation {
    constructor(speed = 15, min = -8, max = 8, objectWidth = 0) {
        super(speed);
        this.offset = 0;
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

class MoveUpAnimation extends MoveBackAnimation {
}

class MoveDownAnimation extends MoveAnimation {
}

class MoveLeftAnimation extends MoveBackAnimation {
}

class MoveRightAnimation extends MoveAnimation {
}

class MoveUpDownAnimation extends ForwardAndBackAnimation {
}

class MoveLeftRightAnimation extends ForwardAndBackAnimation {
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
