/**
 * This abstract class should not be instantiated.
 * Instead use its inheritors Player or BugEnemy
 */
/**
 * @param collisionRectScale parameter to make enemy's/player's collision rect smaller.
 *  Used to make enemies smaller and to make game play more comfortable.
 */
class BaseEnemy {
    constructor(image, left, top) {
        this.image = image;
        this.drawable = this.createDrawable(left, top);
        // this.minSpeed = 300;
        // this.maxSpeed = 400;
        this.minSpeed = 150;
        this.maxSpeed = 300;

        let speed = random(this.minSpeed, this.maxSpeed);
        this.runAnimation = this.createRunAnimation(speed);
        this.drawable.addAnimation(this.runAnimation);
    }

    createDrawable(left, top) {
        return new ImageDrawable(this.image, left, top);
    }

    get rect() {
        return this.drawable.rect;
    }

    createRunAnimation(speed) {
        return new LinearAnimation(this.rect, 'left', speed, 0, canvasWidth);
    }

    render() {
        this.drawable.render();
    }

    /**
     * Reset enemy position and speed
     */
    resetPosition() {
        this.drawable.resetAnimations();
        this.drawable.updateRectCoordinates(0, this.rect.top);
        this.runAnimation.speed = random(this.minSpeed, this.maxSpeed);
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
        this.drawable.update(dt);

        if (this.rect.left >= canvasWidth) {
            this.resetPosition();
        }
    }
}