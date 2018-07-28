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
        // this.minSpeed = 100;
        // this.maxSpeed = 200;
        // this.jumpSpeed = 50;
        this.minSpeed = 150;
        this.maxSpeed = 300;
        this.jumpSpeed = 70;
        this.jumpHeight = 10;
        this.jumpAnimationTimeout = 700;
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
            if (animation instanceof LinearAnimator && animation.propertyName === 'x') {
                animation.speed = random(this.minSpeed, this.maxSpeed);
            }
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
        this.addAnimation(new LinearAnimator(this, 'x', speed, 0, canvasWidth));

        this.beforeJumpY = this.y;
        this.jumpToY = this.y - this.jumpHeight;
        this.jumpAnimation = new UpDownAnimator(this, 'y', this.jumpSpeed, this.y, this.jumpToY, 1);
        this.jumpAnimation.setOnAnimationEndCallback(() => {
            setTimeout(() => {
                this.removeJumpAnimation();
            }, this.jumpAnimationTimeout);
        });
    }

    removeJumpAnimation() {
        this.y = this.beforeJumpY;

        if (this.isJumping()) {
            this.jumpAnimation.reset(); // todo why reset?
            this.removeAnimation(this.jumpAnimation);
        }
    }

    setCoordinates(x, y) {
        super.setCoordinates(x, y);
        this.beforeJumpY = this.y;
        this.jumpToY = this.y - this.jumpHeight;
    }

    resetPosition() {
        this.removeJumpAnimation();
        super.resetPosition();
    }

    jump() {
        this.jumpAnimation.setValues(this.y, this.jumpToY);
        this.addAnimation(this.jumpAnimation);
    }

    isJumping() {
        return this.hasAnimation(this.jumpAnimation);
    }
}

class SharkFinEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_shark_fin.png', x, y);

        let speed = random(this.minSpeed, this.maxSpeed);
        let animation = new UpDownAnimator(this, 'x', speed, 0, canvasWidth, -1, this.image.width);
        this.addAnimation(animation);

        this.imageNormal = res.get('img/enemy_shark_fin.png');
        this.imageRevert = res.get('img/enemy_shark_fin_revert.png');
    }

    update(dt) {
        super.update(dt);

        if (this.x <= 0) {
            this.image = this.imageNormal;
        } else if (this.x + this.image.width >= canvasWidth) {
            this.image = this.imageRevert;
        }
    }
}

// done
// ---------------------------------------------------------
// unfinished

class SharkEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_shark.png', x, y);
        this.addAnimation(new MoveRightAnimation(random(this.minSpeed, this.maxSpeed)));
    }
}
