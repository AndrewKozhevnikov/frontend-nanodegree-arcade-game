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
        this.drawable = new ImageDrawable(image, left, top);
        this.minSpeed = 300;
        this.maxSpeed = 400;

        let speed = random(this.minSpeed, this.maxSpeed);
        this.runAnimation = this.getRunAnimation(speed);
        this.drawable.addAnimation(this.runAnimation);
    }

    get rect() {
        return this.drawable.rect;
    }

    getRunAnimation(speed) {
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