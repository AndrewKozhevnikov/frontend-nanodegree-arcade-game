/**
 * This abstract class should not be instantiated.
 * Instead use its inheritors Player or Enemy
 */
class Unit {
    /**
     * Constructor
     *
     * @param game
     * @param sprite
     * @param width
     * @param height
     * @param collisionRectScale parameter to make enemy's/player's collision rect smaller.
     *  Used to make enemies smaller and to make game play more comfortable.
     */
    constructor(game, sprite, width, height, collisionRectScale) {
        this.game = game;
        this.sprite = sprite;
        this.rect = new Rectangle(width, height, collisionRectScale);
        this.reset();
    }

    /**
     * Make sure this class is never instantiated
     */
    reset() {
        throw new Error('Abstract method. This method should be overridden in inheritor');
    }

    /**
     * Draw on the screen using canvas
     */
    render() {
        const ctx = this.game.engine.ctx;
        ctx.drawImage(res.get(this.sprite), this.rect.left, this.rect.top);
        this.rect.drawCollisionBorder(this.game.engine);
    }
}

class Enemy extends Unit {
    /**
     * Reset enemy to default state
     */
    reset() {
        this.resetPosition();
    }

    /**
     * Reset enemy position, row and speed
     */
    resetPosition() {
        this.movement = getRandomInteger(200, 300);
        this.row = getRandomInteger(1, 3);
        let x = 0;
        let y = (171 / 2) * this.row + this.rect.height / 2;

        this.rect.update(x, y);
    }

    /**
     * Update enemy position.
     * Any movement should be multiplied by the dt.
     * This will ensure the game runs at the same speed for all computers
     * This method is called every game tick, so no object should be created inside this method
     *
     * @param dt a time delta between game ticks
     */
    update(dt) {
        let x = this.rect.left + this.movement * dt;
        if (x >= 505) {
            this.resetPosition();
        } else {
            this.rect.update(x, this.rect.top);
        }
    }
}
