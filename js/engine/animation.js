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

class JumpAnimation {
    constructor(owner, duration = 900, speed = 80, min = -10, max = 0) {
        // todo rename owner
        this.owner = owner;
        this.duration = duration;
        this.startTime = Date.now();

        this.speed = speed;
        this.offset = 0;
        this.min = min;
        this.max = max;
        this.direction = -1;
    }

    update(dt) {
        let now = Date.now();
        if (now >= this.startTime + this.duration) {
            this.owner.stopJumping();
        }

        if (this.direction === 1 && this.offset >= this.max) {
            return 0;
        }

        this.offset = this.offset + this.speed * dt * this.direction;
        if (this.offset <= this.min) {
            this.direction = 1;
        }

        return this.speed * dt * this.direction;
    }
}

class ForwardAndBackAnimation extends Animation {
    constructor(speed = 15, min = -8, max = 8, objectWidth = 0) {
        super(speed);
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

class ScaleUpDownAnimation extends Animation {
    constructor(speed = 2, min = 8, max = 10) {
        super(speed);
        this.offset = min;
        this.min = min;
        this.max = max;
        this.direction = 1;
    }

    update(dt) {
        if (this.offset <= this.min) {
            this.direction = 1;
        } else if (this.offset >= this.max) {
            this.direction = -1;
        }

        this.offset = this.offset + this.speed * dt * this.direction;

        // percent
        return (this.max / 100) * this.offset;
    }
}