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
        // this.minSpeed = 200;
        // this.maxSpeed = 400;
        this.minSpeed = 150;
        this.maxSpeed = 300;
    }

    /**
     * Reset enemy position and speed
     */
    resetPosition() {
        if (this.animation != null) {
            this.animation.setSpeed(random(this.minSpeed, this.maxSpeed));
        }
        this.x = 0;
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
        this.setAnimation(new MoveRightAnimation(random(this.minSpeed, this.maxSpeed)));
    }

    jump() {
        this.beforeJumpY = this.y;
        this.jumpAnimation = new JumpAnimation(this); // fixme  y - below beforeJumpY
    }

    isJumping() {
        return this.jumpAnimation != null;
    }

    stopJumping() {
        this.y = this.beforeJumpY;
        this.jumpAnimation = null;
    }

    update(dt) {
        if (this.jumpAnimation != null) {
            this.applyAnimation(this.jumpAnimation, dt);
        }

        super.update(dt);
    }
}

class SharkFinEnemy extends Enemy {
    constructor(x, y) {
        super('img/enemy_shark_fin.png', x, y);

        let speed = random(this.minSpeed, this.maxSpeed);
        let animation = new MoveLeftRightAnimation(speed, 0, canvasWidth, this.image.width);
        this.setAnimation(animation);

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
        this.setAnimation(new MoveRightAnimation(random(this.minSpeed, this.maxSpeed)));
    }
}
