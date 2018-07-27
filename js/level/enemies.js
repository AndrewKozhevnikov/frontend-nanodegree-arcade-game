class EnemyFactory {
    static getClassByName(name) {
        this.classes = {
            BugEnemy,
            SharkFinEnemy,
            SharkEnemy
        };

        return this.classes[name];
    }
}

/**
 * This abstract class should not be instantiated.
 * Instead use its inheritors Player or BugEnemy
 */
/**
 * @param collisionRectScale parameter to make enemy's/player's collision rect smaller.
 *  Used to make enemies smaller and to make game play more comfortable.
 */
class Enemy extends ImageDrawable {
    constructor(imageUrl, x, y) {
        super(imageUrl, x, y);
        this.minSpeed = 20;
        this.maxSpeed = 20;
        // this.minSpeed = 50;
        // this.maxSpeed = 100;
        // this.minSpeed = 100;
        // this.maxSpeed = 200;
        // this.minSpeed = 150;
        // this.maxSpeed = 300;
    }

    /**
     * Reset enemy position and speed
     */
    resetPosition() {
        this.resetAnimations();
        this.x = 0;
    }

    resetAnimations() {
        this.animations.forEach(animation => {
            animation.reset();
            animation.speed = random(this.minSpeed, this.maxSpeed); // todo speed only for movement
        });
    }

    /**
     * Update enemy position.
     * Any speed should be multiplied by the dt.
     * This will ensure the game runs at the same speed for all computers
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        super.update(dt);

        if (this.x >= canvasWidth) {
            this.resetPosition();
        }
    }
}

class BugEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_bug.png', x, y);
        let speed = random(this.minSpeed, this.maxSpeed);
        // todo animator or animation ?
        this.addAnimation(new ValueAnimator(this, 'x', speed, 0, canvasWidth));

        this.beforeJumpY = this.y;
        this.jumpAnimation = new UpDownAnimator(this, 'y', 40, this.y, this.y + 20, 1); // todo -50
        this.jumpAnimation.setOnAnimationEndCallback(() => {
            this.y = this.beforeJumpY;
            this.removeAnimation(this.jumpAnimation);
        });
    }

    setCoordinates(x, y) {
        super.setCoordinates(x, y);
        this.beforeJumpY = this.y;
    }

    resetPosition() {
        this.y = this.beforeJumpY;

        if (this.hasAnimation(this.jumpAnimation)) {
            this.jumpAnimation.reset();
            this.removeAnimation(this.jumpAnimation);
        }

        super.resetPosition();
    }

    jump() {
        this.jumpAnimation.setValues(this.y, this.y + 50);
        this.addAnimation(this.jumpAnimation);
    }

    isJumping() {
        return this.hasAnimation(this.jumpAnimation);
    }
}

// ---------------------------------------------------------

class SharkFinEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_shark_fin.png', x, y);

        let speed = random(this.minSpeed, this.maxSpeed);
        let animation = new MoveLeftRightAnimation(speed, 0, canvasWidth, this.image.width);
        this.addAnimation(animation);

        this.imageNormal = res.get('img/enemy_shark_fin.png');
        this.imageRevert = res.get('img/enemy_shark_fin_revert.png');
    }

    update(dt) {
        super.update(dt);

        if (this.x <= 0) {
            this.image = this.imageNormal;
        } else if (this.x + this.image.width >= canvasWidth) { // rotate animation ???
            this.image = this.imageRevert;
        }
    }
}

class SharkEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_shark.png', x, y);
        this.addAnimation(new MoveRightAnimation(random(this.minSpeed, this.maxSpeed)));
    }
}
